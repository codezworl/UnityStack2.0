const express = require("express");
const {
  signupStudent,
  loginStudent,
  verifyStudentEmail, // Import the email verification handler
} = require("../Controllers/studentController");

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

module.exports = router;
