const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

// Signup handler
const signupStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      university,
      universityEmail,
      semester,
      domain,
      linkedIn,
      github,
    } = req.body;

    // Validate input fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if the student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student
    const newStudent = new Student({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      university,
      universityEmail,
      semester,
      domain,
      linkedIn,
      github,
    });

    await newStudent.save();

    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login handler
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if the student exists
    const existingStudent = await Student.findOne({ email });
    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, existingStudent.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: existingStudent._id, email: existingStudent.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      student: {
        id: existingStudent._id,
        firstName: existingStudent.firstName,
        lastName: existingStudent.lastName,
        email: existingStudent.email,
      },
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { signupStudent, loginStudent };