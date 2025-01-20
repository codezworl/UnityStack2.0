const express = require("express");
const { registerDeveloper, loginDeveloper,VerifyEmail, } = require("../Controllers/developerController"); // Ensure correct path

const router = express.Router();

// Route for developer registration
router.post("/register", registerDeveloper);
router.post("/verifyemail",VerifyEmail);
// Route for developer login
router.post("/login", loginDeveloper);

module.exports = router;
