const express = require("express");
const {
  signupStudent,
  loginStudent,
  verifyStudentEmail,
  getStudentProfile,
  updateStudentProfile,
  deleteStudentAccount,
  updateProfileImage, upload, // Import the email verification handler
} = require("../Controllers/studentController");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Route for student signup
router.post(
  "/signup",
  (req, res, next) => {
    console.log("Signup request received", req.body); // Log request for debugging
    next();
  },
  signupStudent
);

// Route for student login
router.post(
  "/login",
  (req, res, next) => {
    console.log("Login request received", req.body); // Log request for debugging
    next();
  },
  loginStudent
);

// Route for student email verification
router.post(
  "/verify-email",
  (req, res, next) => {
    console.log("Email verification request received", req.body); // Log request for debugging
    next();
  },
  verifyStudentEmail
);
// ✅ Route to fetch student profile
router.get("/profile", authenticateToken, getStudentProfile);

// ✅ Route to update student profile
router.put("/profile", authenticateToken, updateStudentProfile);

// ✅ Route to delete student account
router.delete("/profile", authenticateToken, deleteStudentAccount);
router.put("/profile-image", authenticateToken, upload.single("profileImage"), updateProfileImage);
module.exports = router;
