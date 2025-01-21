const Developer = require("../models/Develpor"); // Ensure the correct path
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SendVerificationCode } = require("../middleware/Email");

// Register Developer
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

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check if the email is already registered
    const existingDeveloper = await Developer.findOne({ email });
    if (existingDeveloper) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new developer
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

    // Send verification code to email
    await SendVerificationCode(developer.email, developer.verificationCode);

    res.status(201).json({
      message: "Developer registered successfully. Verification email sent.",
    });
  } catch (error) {
    console.error("Error registering developer:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Login Developer
const loginDeveloper = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find developer by email
    const developer = await Developer.findOne({ email });
    if (!developer) {
      return res.status(404).json({ message: "Developer not found." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, developer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate a JWT token
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

// Verify Email
const VerifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    // Find developer by verification code
    const developer = await Developer.findOne({ verificationCode: code });
    if (!developer) {
      return res.status(404).json({ message: "Invalid verification code." });
    }

    // Mark as verified and clear the verification code
    developer.isVerified = true;
    developer.verificationCode = undefined;
    await developer.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error verifying email:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Export all functions
module.exports = {
  registerDeveloper,
  loginDeveloper,
  VerifyEmail,
};
