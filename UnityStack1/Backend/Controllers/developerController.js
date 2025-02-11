const Developer = require("../models/Develpor"); // Ensure the correct path
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SendVerificationCode } = require("../middleware/Email");

// ✅ Register Developer (No Changes)
const registerDeveloper = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      confirmPassword,
      domainTags,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingDeveloper = await Developer.findOne({ email });
    if (existingDeveloper) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const developer = new Developer({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      domainTags,
      verificationCode,
    });

    await developer.save();
    await SendVerificationCode(developer.email, developer.verificationCode);

    res.status(201).json({
      message: "Developer registered successfully. Verification email sent.",
    });
  } catch (error) {
    console.error("Error registering developer:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Login Developer (No Changes)
const loginDeveloper = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const developer = await Developer.findOne({ email });
    if (!developer) {
      return res.status(404).json({ message: "Developer not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, developer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: developer._id, role: "developer" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      role: "developer",
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Verify Email (No Changes)
const VerifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    const developer = await Developer.findOne({ verificationCode: code });
    if (!developer) {
      return res.status(404).json({ message: "Invalid verification code." });
    }

    developer.isVerified = true;
    developer.verificationCode = undefined;
    await developer.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error verifying email:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Get Developer Profile (New)
const getDeveloperProfile = async (req, res) => {
  try {
    const developerId = req.user.id;
    const developer = await Developer.findById(developerId).select("-password -verificationCode");

    if (!developer) {
      return res.status(404).json({ message: "Developer not found." });
    }

    res.status(200).json(developer);
  } catch (error) {
    console.error("Error fetching developer profile:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Update Developer Profile (New)
const updateProfile = async (req, res) => {
  try {
    const developerId = req.user.id;
    const {
      profileImage,
      about,
      hourlyRate,
      availability,
      expertise,
      employment,
      github,
      linkedIn,
    } = req.body;

    const updatedDeveloper = await Developer.findByIdAndUpdate(
      developerId,
      {
        profileImage,
        about,
        hourlyRate,
        availability,
        github,
        linkedIn,
        expertise,
        employment,
      },
      { new: true }
    );

    if (!updatedDeveloper) {
      return res.status(404).json({ message: "Developer not found." });
    }

    res.status(200).json({ message: "Profile updated successfully", developer: updatedDeveloper });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Export All Functions
module.exports = {
  registerDeveloper,
  loginDeveloper,
  VerifyEmail,
  getDeveloperProfile, // ✅ New function to fetch profile
  updateProfile, // ✅ New function to update profile
};
