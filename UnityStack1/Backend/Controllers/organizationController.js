const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization");

// Signup handler
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
    });

    await newOrganization.save();

    res.status(201).json({ message: "Organization registered successfully" });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login handler
const loginOrganization = async (req, res) => {
  try {
    const { companyEmail, password } = req.body;

    // Validate input fields
    if (!companyEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if the organization exists
    const existingOrganization = await Organization.findOne({ companyEmail });
    if (!existingOrganization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, existingOrganization.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: existingOrganization._id, companyEmail: existingOrganization.companyEmail },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      organization: {
        id: existingOrganization._id,
        companyName: existingOrganization.companyName,
        companyEmail: existingOrganization.companyEmail,
      },
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { signupOrganization, loginOrganization };
