const express = require("express");
const {
  signupOrganization,
  loginOrganization,
  verifyOrganizationEmail, // Import the email verification handler
} = require("../Controllers/organizationController");

const router = express.Router();

// Route for organization signup
router.post(
  "/signup",
  (req, res, next) => {
    console.log("Organization signup request received", req.body); // Debugging log
    next();
  },
  signupOrganization
);

// Route for organization login
router.post(
  "/login",
  (req, res, next) => {
    console.log("Organization login request received", req.body); // Debugging log
    next();
  },
  loginOrganization
);

// Route for email verification
router.post(
  "/verify-email",
  (req, res, next) => {
    console.log("Organization email verification request received", req.body); // Debugging log
    next();
  },
  verifyOrganizationEmail
);

module.exports = router;
