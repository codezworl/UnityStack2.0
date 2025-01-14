const express = require("express");
const { signupOrganization, loginOrganization } = require("../controllers/organizationController");

const router = express.Router();

// Route for organization signup
router.post("/signup", (req, res, next) => {
  console.log("Organization signup request received", req.body); // Log request for debugging
  next();
}, signupOrganization);

// Route for organization login
router.post("/login", (req, res, next) => {
  console.log("Organization login request received", req.body); // Log request for debugging
  next();
}, loginOrganization);

module.exports = router;
