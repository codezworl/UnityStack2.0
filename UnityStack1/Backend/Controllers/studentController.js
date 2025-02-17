const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");  // ✅ Import path module
const multer = require("multer");
const fs = require("fs");

const Student = require("../models/Student");
const { SendVerificationCode } = require("../middleware/Email"); // Ensure this is the correct path
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in the `uploads/` directory
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Initialize `multer`
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit: 5MB per file
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (JPG, PNG) are allowed!"));
    }
  },
});


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
const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id; // Extract student ID from authenticated request

    const student = await Student.findById(studentId).select("-password"); // Exclude password
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student profile:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updateStudentProfile = async (req, res) => {
  try {
    console.log("🔍 Received data for update:", req.body); // ✅ Debugging log

    // Check if user exists
    const student = await Student.findById(req.user.id);
    if (!student) {
      console.log("❌ Student not found.");
      return res.status(404).json({ message: "Student not found" });
    }

    // Update only the fields that are provided
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        student[key] = req.body[key];
      }
    });

    await student.save(); // ✅ Save the updated student profile

    console.log("✅ Profile updated successfully:", student);
    res.status(200).json(student);
  } catch (error) {
    console.error("❌ Error updating student profile:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteStudentAccount = async (req, res) => {
  try {
    const studentId = req.user.id;
    await Student.findByIdAndDelete(studentId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting student account:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.profileImage = `/uploads/${req.file.filename}`; // Save image path in DB
    await student.save();

    res.status(200).json({ profileImage: student.profileImage });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  signupStudent,
  verifyStudentEmail, // Add the email verification handler
  loginStudent,
  getStudentProfile,
  updateStudentProfile,
  deleteStudentAccount,
  updateProfileImage,
  upload, // Export `multer` for route usage
};
