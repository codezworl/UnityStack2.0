const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const { SendVerificationCode } = require("../middleware/Email"); // Ensure this is the correct path

// Signup handler with verification
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

    // Generate a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

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
      verificationCode, // Store the verification code
      isVerified: false, // Default to not verified
    });

    await newStudent.save();

    // Send verification code to the student's email
    await SendVerificationCode(email, verificationCode);

    res.status(201).json({
      message: "Student registered successfully. Verification email sent.",
    });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify email handler
const verifyStudentEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Find student by email and verification code
    const student = await Student.findOne({ email, verificationCode: code });
    if (!student) {
      return res.status(404).json({ message: "Invalid verification code or email." });
    }

    // Mark as verified and clear the verification code
    student.isVerified = true;
    student.verificationCode = undefined;
    await student.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error in email verification:", error.message);
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
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the email is verified
    if (!student.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify your email." });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: student._id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      },
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  signupStudent,
  verifyStudentEmail, // Add the email verification handler
  loginStudent,
};
