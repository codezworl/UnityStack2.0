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

// ✅ Update Developer Schedule
router.put("/schedule", authenticateToken, async (req, res) => {
  try {
    const { schedule } = req.body;
    const developerId = req.user.id;

    // Validate schedule format
    if (!schedule || typeof schedule !== 'object') {
      return res.status(400).json({ message: 'Invalid schedule format' });
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const dayMap = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };

    // Validate each day's schedule
    for (const day of days) {
      if (!schedule[day] || typeof schedule[day] !== 'object') {
        return res.status(400).json({ message: `Invalid schedule format for ${day}` });
      }

      const slotDay = dayMap[day];
      const isCurrentOrNextDay = slotDay === currentDay || slotDay === (currentDay + 1) % 7;

      // Only allow modifications for current and next day
      if (!isCurrentOrNextDay) {
        // For other days, keep the existing schedule
        const existingSchedule = await Developer.findById(developerId).select(`schedule.${day}`);
        if (existingSchedule && existingSchedule.schedule) {
          schedule[day] = existingSchedule.schedule.get(day) || {};
        }
        continue;
      }

      // For current and next day, validate each slot
      for (const [slot, status] of Object.entries(schedule[day])) {
        if (!['Available', 'Not Available'].includes(status)) {
          return res.status(400).json({ message: `Invalid status for ${day} ${slot}` });
        }

        // For current day, prevent modifying past slots
        if (slotDay === currentDay) {
          const [slotHour] = slot.split('-')[0].split(':').map(Number);
          if (slotHour <= currentHour) {
            // Keep past slots as they are
            const existingSchedule = await Developer.findById(developerId).select(`schedule.${day}.${slot}`);
            if (existingSchedule && existingSchedule.schedule) {
              schedule[day][slot] = existingSchedule.schedule.get(day)?.get(slot) || 'Available';
            }
          }
        }
      }
    }

    // Update the schedule
    const updatedDeveloper = await Developer.findByIdAndUpdate(
      developerId,
      { $set: { schedule } },
      { new: true, runValidators: true }
    );

    if (!updatedDeveloper) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    res.json({ message: 'Schedule updated successfully', schedule: updatedDeveloper.schedule });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Error updating schedule' });
  }
});

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
