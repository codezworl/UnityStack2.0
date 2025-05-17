const express = require("express");
const {
  registerDeveloper,
  loginDeveloper,
  VerifyEmail,
  getDeveloperProfile,
  updateProfile,
  uploadProfileImage,
  removeExpertise,  // ✅ Import removeExpertise function
  removeJobExperience,  // ✅ Import removeJobExperience function
  deleteAccount,
  updateExpertise, // ✅ Import update expertise function
  updateJobExperience, // ✅ Import update job experience function // ✅ Ensure updateProfile is imported
  requestOtp, // Add the request OTP function
} = require("../Controllers/developerController");

const authenticateToken = require("../middleware/auth"); // ✅ Correct way to import
 // ✅ Ensure correct import
const Developer = require("../models/Develpor"); // ✅ Ensure model import

const router = express.Router();

// ✅ Request OTP before registration
router.post("/request-otp", requestOtp);

// ✅ Register a New Developer
router.post("/register", registerDeveloper);

// ✅ Verify Email (OTP Verification)
router.post("/verifyemail", VerifyEmail);

// ✅ Developer Login
router.post("/login", loginDeveloper);

// ✅ Fetch a Specific Developer Profile (Public)
router.get("/:id", getDeveloperProfile);

// ✅ Update Profile (With Image Upload)
router.put("/profile", authenticateToken, uploadProfileImage, updateProfile); // ✅ Ensure `authenticate` is defined

// ✅ Fetch All Developers
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
router.delete("/expertise/:expertiseId", authenticateToken, removeExpertise);

// ✅ Delete a Job Experience (Protected Route)
router.delete("/job/:jobId", authenticateToken, removeJobExperience);

// ✅ Delete Account (Protected Route)
router.delete("/delete-account", authenticateToken, deleteAccount);
router.put("/expertise/:expertiseId", authenticateToken, updateExpertise);

// ✅ Update an existing Job Experience
router.put("/job/:jobId", authenticateToken, updateJobExperience);
module.exports = router;
