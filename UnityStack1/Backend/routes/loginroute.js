const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Student = require("../models/Student");
const Organization = require("../models/Organization");
const Developer = require("../models/Develpor");
const { SendVerificationCode } = require("../middleware/Email");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // ✅ Read token from cookies
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid session" });
    req.user = user;
    next();
  });
};

// ✅ Define OTP Schema & Model
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});
const OTP = mongoose.model("OTP", otpSchema);

// ✅ Configure Nodemailer with provided credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "info.freshrose@gmail.com",
    pass: "btfx cegj vgnh jzww",
  },
});

// ✅ Generate 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

/** 
 * ✅ LOGIN ROUTE (Works as before)
 * @route POST /api/login
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user in the database
    const student = await Student.findOne({ email });
    const organization = await Organization.findOne({ companyEmail: email });
    const developer = await Developer.findOne({ email });

    let user = student || organization || developer;
    let role = student ? "student" : organization ? "organization" : "developer";

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Store token in HTTP-Only Cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    });
    
    // Return complete user data with displayName
    return res.status(200).json({
      message: "Login successful.",
      role,
      token,
      user: {
        _id: user._id,
        email: user.email || user.companyEmail,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        profileImage: user.profileImage || user.logo,
        displayName: role === 'organization' 
          ? user.companyName 
          : `${user.firstName} ${user.lastName || ''}`.trim()
      }
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});



/** 
 * ✅ SEND OTP for Password Reset 
 * @route POST /api/send-otp
 */
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Find user in the database
    const student = await Student.findOne({ email });
    const organization = await Organization.findOne({ companyEmail: email });
    const developer = await Developer.findOne({ email });

    let user = student || organization || developer;
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in MongoDB
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiresAt: Date.now() + 300000 }, // OTP expires in 5 mins
      { upsert: true }
    );

    console.log(`Generated OTP for ${email}: ${otp}`); // ✅ Debugging

    // Send OTP via email using your existing email system
    await SendVerificationCode(email, `<p>Your password reset OTP is: <b>${otp}</b></p>`);

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

/** 
 * ✅ VERIFY OTP (Before Resetting Password)
 * @route POST /api/verify-otp
 */
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    // Retrieve OTP from database
    const storedOTP = await OTP.findOne({ email });

    if (!storedOTP) {
      return res.status(400).json({ message: "OTP expired or not requested." });
    }

    // Check expiration
    if (Date.now() > storedOTP.expiresAt) {
      await OTP.deleteOne({ email }); // Delete expired OTP
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Validate OTP
    if (storedOTP.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please enter the correct code." });
    }

    console.log(`OTP verification successful for ${email}`); // Debugging

    // OTP is valid, allow password reset
    res.status(200).json({ message: "OTP verified successfully. Proceed to reset your password." });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

/** 
 * ✅ RESET PASSWORD (After OTP is verified)
 * @route POST /api/reset-password
 */
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in the correct collection
    let user = await Student.findOneAndUpdate({ email }, { password: hashedPassword });
    if (!user) user = await Organization.findOneAndUpdate({ companyEmail: email }, { password: hashedPassword });
    if (!user) user = await Developer.findOneAndUpdate({ email }, { password: hashedPassword });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete OTP after successful reset
    await OTP.deleteOne({ email });

    res.status(200).json({ message: "Password reset successfully. You can now login." });
  } catch (error) {
    console.error("Error resetting password:", error.message);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});
// user fetch 
router.get("/user", authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized - No valid token" });
    }

    const userId = req.user.id;
    console.log(`Fetching user data for ID: ${userId}`);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Fetch user from all possible collections
    const student = await Student.findById(userId);
    const organization = await Organization.findById(userId);
    const developer = await Developer.findById(userId);

    let user = student || organization || developer;

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    console.log("User found:", user);

    // Return complete user data with displayName
    res.status(200).json({
      _id: user._id,
      role: req.user.role,
      email: user.email || user.companyEmail,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      profileImage: user.profileImage || user.logo,
      displayName: req.user.role === 'organization' 
        ? user.companyName 
        : `${user.firstName} ${user.lastName || ''}`.trim()
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});



// logout 
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully." });
});


module.exports = router;