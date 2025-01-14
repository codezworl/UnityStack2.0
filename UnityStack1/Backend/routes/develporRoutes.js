const express = require("express");
const { registerDeveloper } = require("../Controllers/developerController");

const router = express.Router();

// Route for developer registration
router.post("/register", registerDeveloper);

module.exports = router;
