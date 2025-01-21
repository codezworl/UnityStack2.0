const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization");
const { SendVerificationCode } = require("../middleware/Email"); // Ensure this path is correct

// Signup handler with verification
const signupOrganization = async (req, res) => {
  try {
    const {
      companyName,
      address,
      branches,
      operatingCities,
      website,
      companyEmail,
      password,
      selectedServices,
    } = req.body;

    // Validate input fields
    if (!companyName || !companyEmail || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if the organization already exists
    const existingOrganization = await Organization.findOne({ companyEmail });
    if (existingOrganization) {
      return res.status(400).json({ message: "Organization already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new organization
    const newOrganization = new Organization({
      companyName,
      address,
      branches,
      operatingCities,
      website,
      companyEmail,
      password: hashedPassword,
      selectedServices,
      verificationCode, // Store the verification code
      isVerified: false, // Default to not verified
    });

    await newOrganization.save();

    // Send verification code to the organization's email
    await SendVerificationCode(companyEmail, verificationCode);

    res.status(201).json({
      message: "Organization registered successfully. Verification email sent.",
    });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify email handler
const verifyOrganizationEmail = async (req, res) => {
  try {
    const { companyEmail, code } = req.body;

    // Find organization by email and verification code
    const organization = await Organization.findOne({ companyEmail, verificationCode: code });
    if (!organization) {
      return res.status(404).json({ message: "Invalid verification code or email." });
    }

    // Mark as verified and clear the verification code
    organization.isVerified = true;
    organization.verificationCode = undefined;
    await organization.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error in email verification:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login handler
const loginOrganization = async (req, res) => {
  try {
    const { companyEmail, password } = req.body;

    // Validate input fields
    if (!companyEmail || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if the organization exists
    const organization = await Organization.findOne({ companyEmail });
    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // Check if the email is verified
    if (!organization.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify your email." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, organization.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: organization._id, role: "organization" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      organization: {
        id: organization._id,
        companyName: organization.companyName,
        companyEmail: organization.companyEmail,
      },
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = {
  signupOrganization,
  verifyOrganizationEmail, // Add the email verification handler
  loginOrganization,
};
