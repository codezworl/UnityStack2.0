const express = require("express");
const { signupStudent, loginStudent } = require("../controllers/studentController");

const router = express.Router();

// Route for student signup
router.post("/signup", (req, res, next) => {
  console.log("Signup request received", req.body); // Log request for debugging
  next();
}, signupStudent);

// Route for student login
router.post("/login", (req, res, next) => {
  console.log("Login request received", req.body); // Log request for debugging
  next();
}, loginStudent);

module.exports = router;
