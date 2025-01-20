const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Organization = require("../models/Organization");
const Developer = require("../models/Develpor");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Attempt to find the user in each collection
    const student = await Student.findOne({ email });
    const organization = await Organization.findOne({ companyEmail: email });
    const developer = await Developer.findOne({ email });

    let user = null;
    let role = null;

    if (student) {
      user = student;
      role = "student";
    } else if (organization) {
      user = organization;
      role = "organization";
    } else if (developer) {
      user = developer;
      role = "developer";
    }

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

    res.status(200).json({
      message: "Login successful.",
      token,
      role,
      user: {
        id: user._id,
        email: user.email || user.companyEmail,
      },
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
