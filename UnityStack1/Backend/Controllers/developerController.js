const Developer = require("../models/Develpor");
const bcrypt = require("bcryptjs");

exports.registerDeveloper = async (req, res) => {
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

    // Create new developer
    const developer = new Developer({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      domainTags,
    });

    await developer.save();

    res.status(201).json({ message: "Developer registered successfully." });
  } catch (error) {
    console.error("Error registering developer:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
