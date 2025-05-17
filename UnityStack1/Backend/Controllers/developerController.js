const Developer = require("../models/Develpor");
const Question = require('../models/question');
const Student = require("../models/Student");
const Organization = require("../models/Organization");
const Answer = require("../models/answer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const { SendVerificationCode } = require("../middleware/Email");
const Project = require("../models/Project");
const ProjectHistory = require("../models/ProjectHistory");

const Notification = require("../models/notification");
const Bid = require('../models/Bid');

// ✅ Multer Configuration for Profile Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Register Developer
const registerDeveloper = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phoneNumber, 
      homeNumber,
      password, 
      confirmPassword, 
      domainTags,
      verified // Check if developer is pre-verified by OTP
    } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingDeveloper = await Developer.findOne({ email });
    if (existingDeveloper) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Only generate verification code if not pre-verified
    let verificationCode;
    let isVerified = false;
    
    if (!verified) {
      verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      isVerified = false;
    } else {
      verificationCode = undefined;
      isVerified = true;
    }

    const developer = new Developer({
      firstName,
      lastName,
      email,
      phoneNumber,
      homeNumber: homeNumber || "", // Provide empty string default if not provided
      password: hashedPassword,
      domainTags,
      verificationCode,
      isVerified, // Set verified status
      isOnline: false,
    });

    await developer.save();
    
    // Only send verification email if not pre-verified
    if (!verified) {
      await SendVerificationCode(developer.email, developer.verificationCode);
    }

    res.status(201).json({ 
      message: verified 
        ? "Developer registered successfully." 
        : "Developer registered successfully. Verification email sent." 
    });
  } catch (error) {
    console.error("Error registering developer:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Login Developer
const loginDeveloper = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const developer = await Developer.findOne({ email });
    if (!developer) {
      return res.status(404).json({ message: "Developer not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, developer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // ✅ Set developer as online after successful login
    developer.isOnline = true;
    await developer.save();

    const token = jwt.sign({ id: developer._id, role: "developer" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.status(200).json({ message: "Login successful.", token, developer });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Logout Developer
const logoutDeveloper = async (req, res) => {
  try {
    const developerId = req.user.id;
    const developer = await Developer.findById(developerId);

    if (!developer) {
      return res.status(404).json({ message: "Developer not found." });
    }

    // ✅ Set developer as offline
    developer.isOnline = false;
    await developer.save();

    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Verify Email
const VerifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and verification code are required." });
    }

    // Get TempVerification model
    const TempVerification = mongoose.model('TempVerification');

    // First check TempVerification collection (for pre-registration OTP)
    const tempVerification = await TempVerification.findOne({ 
      email, 
      verificationCode: code 
    });

    // If found in temp verification
    if (tempVerification) {
      // Check if the code has expired
      if (tempVerification.expiresAt < new Date()) {
        await TempVerification.deleteOne({ email });
        return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
      }

      // Code is valid
      return res.status(200).json({ message: "Email verified successfully." });
    }

    // If not found in TempVerification, check Developer collection (for existing users)
    const developer = await Developer.findOne({ email, verificationCode: code });
    if (!developer) {
      return res.status(404).json({ message: "Invalid verification code." });
    }

    developer.isVerified = true;
    developer.verificationCode = undefined;
    await developer.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error verifying email:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Get Developer Profile
const getDeveloperProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const developer = await Developer.findById(id).select("-password");

    if (!developer) return res.status(404).json({ message: "Developer not found." });

    res.status(200).json(developer);
  } catch (error) {
    console.error("❌ Error fetching developer profile:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Update Developer Profile (Fully Fixed)
const updateProfile = async (req, res) => {
  try {
    const developerId = req.user.id;
    if (!developerId) {
      return res.status(401).json({ message: "Unauthorized: No user found in token." });
    }

    // Extract Fields from Request Body
    const { about, hourlyRate, workingHours, expertise, employment, linkedIn, github } = req.body;

    // ✅ Convert JSON Strings to Objects (If Required)
    let parsedWorkingHours = typeof workingHours === "string" ? JSON.parse(workingHours) : workingHours;
    let parsedExpertise = typeof expertise === "string" ? JSON.parse(expertise) : expertise;
    let parsedEmployment = typeof employment === "string" ? JSON.parse(employment) : employment;

    // ✅ Handle Profile Image Upload
    const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    // ✅ Fields to Update
    const updateFields = {
      about,
      hourlyRate,
      workingHours: parsedWorkingHours,
      expertise: parsedExpertise,
      employment: parsedEmployment,
      linkedIn,
      github,
    };

    if (profileImage) {
      updateFields.profileImage = profileImage;
    }

    // ✅ Update Developer Profile
    const updatedDeveloper = await Developer.findByIdAndUpdate(
      developerId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedDeveloper) {
      return res.status(404).json({ message: "Developer not found." });
    }

    res.status(200).json({ message: "Profile updated successfully", developer: updatedDeveloper });
  } catch (error) {
    console.error("❌ Error updating profile:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Middleware to Handle File Upload
const uploadProfileImage = upload.single("profileImage");

// ✅ Remove a Specific Expertise
const removeExpertise = async (req, res) => {
  try {
      const developer = await Developer.findById(req.user.id);

      if (!developer) {
          return res.status(404).json({ message: "Developer not found." });
      }

      const expertiseId = req.params.expertiseId;

      // ✅ Ensure only the selected expertise is removed
      developer.expertise = developer.expertise.filter(exp => exp._id.toString() !== expertiseId);

      await developer.save();
      res.status(200).json({ message: "Expertise removed successfully.", expertise: developer.expertise });
  } catch (error) {
      console.error("❌ Error removing expertise:", error);
      res.status(500).json({ message: "Server error." });
  }
};

// ✅ Update Expertise
// ✅ Update Expertise Function (Backend)
const updateExpertise = async (req, res) => {
  try {
    const developerId = req.user?.id;  // ✅ Ensure req.user.id is available
    if (!developerId) return res.status(401).json({ message: "Unauthorized: User ID missing." });

    const { expertiseId } = req.params;
    const { domain, experienceYears, projects } = req.body;

    // ✅ Find Developer
    const developer = await Developer.findById(developerId);
    if (!developer) return res.status(404).json({ message: "Developer not found." });

    // ✅ Find Expertise to Update
    const expertiseIndex = developer.expertise.findIndex(exp => exp._id.toString() === expertiseId);
    if (expertiseIndex === -1) return res.status(404).json({ message: "Expertise not found." });

    // ✅ Update Expertise
    developer.expertise[expertiseIndex] = { _id: expertiseId, domain, experienceYears, projects };

    await developer.save();

    res.status(200).json({ message: "Expertise updated successfully", expertise: developer.expertise });
  } catch (error) {
    console.error("❌ Error updating expertise:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Remove a Specific Job Experience
const removeJobExperience = async (req, res) => {
  try {
      const developer = await Developer.findById(req.user.id);

      if (!developer) {
          return res.status(404).json({ message: "Developer not found." });
      }

      const jobId = req.params.jobId;

      // ✅ Ensure only the selected job is removed
      developer.employment = developer.employment.filter(job => job._id.toString() !== jobId);

      await developer.save();
      res.status(200).json({ message: "Job experience removed successfully.", employment: developer.employment });
  } catch (error) {
      console.error("❌ Error removing job experience:", error);
      res.status(500).json({ message: "Server error." });
  }
};

// ✅ Update Job Experience
const updateJobExperience = async (req, res) => {
  try {
    const developerId = req.user?.id; // ✅ Ensure developer ID is read correctly
    const { jobId } = req.params;
    const { companyName, position, startDate, endDate } = req.body;

    if (!developerId) return res.status(401).json({ message: "Unauthorized: No user found." });

    const developer = await Developer.findById(developerId);
    if (!developer) return res.status(404).json({ message: "Developer not found." });

    // ✅ Log Job ID for debugging
    console.log("Updating Job Experience for ID:", jobId);

    const jobIndex = developer.employment.findIndex(job => job._id.toString() === jobId);
    if (jobIndex === -1) return res.status(404).json({ message: "Job experience not found." });

    // ✅ Update job experience
    developer.employment[jobIndex] = { _id: jobId, companyName, position, startDate, endDate };

    await developer.save();

    res.status(200).json({ message: "Job experience updated successfully", employment: developer.employment });
  } catch (error) {
    console.error("❌ Error updating job experience:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Delete Account (Only for Logged-In User)
const deleteAccount = async (req, res) => {
  try {
    const developerId = req.user.id;
    if (!developerId) return res.status(401).json({ message: "Unauthorized." });

    await Developer.findByIdAndDelete(developerId);

    res.clearCookie("token");
    res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting account:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// ✅ Request OTP before registration
const requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if email exists in any of the databases
    const existingDeveloper = await Developer.findOne({ email });
    const existingStudent = await Student.findOne({ email });
    const existingOrganization = await Organization.findOne({ companyEmail: email });

    // If email exists in any database, return error
    if (existingDeveloper) {
      return res.status(400).json({ message: "Email already registered as a Developer" });
    }
    
    if (existingStudent) {
      return res.status(400).json({ message: "Email already registered as a Student" });
    }
    
    if (existingOrganization) {
      return res.status(400).json({ message: "Email already registered as an Organization" });
    }

    // Generate a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the verification code temporarily
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);

    // Use the TempVerification model
    const TempVerification = mongoose.model('TempVerification');
    
    // Store in temporary collection or update if exists
    await TempVerification.findOneAndUpdate(
      { email },
      { 
        email,
        verificationCode, 
        expiresAt: expiryTime 
      },
      { upsert: true, new: true }
    );

    // Send verification code to the provided email
    await SendVerificationCode(email, verificationCode);

    res.status(200).json({
      message: "Verification code sent to email",
    });
  } catch (error) {
    console.error("Error requesting OTP:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Export New Functions
module.exports = {
  registerDeveloper,
  loginDeveloper,
  logoutDeveloper,
  VerifyEmail,
  getDeveloperProfile,
  updateProfile,
  uploadProfileImage,
  removeExpertise,
  removeJobExperience,
  deleteAccount,
  updateExpertise, // ✅ Import update expertise function
  updateJobExperience,
  requestOtp, // ✅ Add the OTP request handler
};
