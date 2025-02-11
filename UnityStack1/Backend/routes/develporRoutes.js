const express = require("express");
const {
  registerDeveloper,
  loginDeveloper,
  VerifyEmail,
  getDeveloperProfile,
  updateProfile,
} = require("../Controllers/developerController");

const Developer = require("../models/Develpor"); // ✅ Ensure correct path

const router = express.Router();

// ✅ Existing Routes (No changes)
router.post("/register", registerDeveloper);
router.post("/verifyemail", VerifyEmail);
router.post("/login", loginDeveloper);
router.get("/profile", getDeveloperProfile);
router.put("/profile", updateProfile);

// ✅ Fix: Add a route to fetch all developers
router.get("/developers", async (req, res) => {
  try {
    const developers = await Developer.find().select("-password -verificationCode");

    if (!developers || developers.length === 0) {
      return res.status(404).json({ message: "No developers found." });
    }

    res.status(200).json(developers);
  } catch (error) {
    console.error("Error fetching developers:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
