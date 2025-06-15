const mongoose = require("mongoose");

// Define the schema for the Student collection
const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true,
      validate: {
        validator: function (v) {
          return /\S+@\S+\.\S+/.test(v); // Basic email validation
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    university: { type: String, required: true, trim: true },
    universityEmail: { 
      type: String, 
      required: true, 
      unique: true, 
      trim: true, 
      lowercase: true,
      validate: {
        validator: function (v) {
          return /\S+@\S+\.\S+/.test(v); // Basic email validation
        },
        message: (props) => `${props.value} is not a valid university email!`,
      },
    },
    semester: { 
      type: Number, 
      required: true, 
      min: [1, "Semester must be at least 1"], 
      max: [8, "Semester cannot be more than 8"] 
    },
    domain: { type: String, required: true, trim: true },
    linkedIn: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // Allow empty
          // More permissive regex that accepts various forms of LinkedIn URLs
          return /linkedin\.com/i.test(v);
        },
        message: (props) => `${props.value} is not a valid LinkedIn profile URL!`,
      },
    },
    github: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // Allow empty
          // More permissive regex that accepts various forms of GitHub URLs
          return /github\.com/i.test(v);
        },
        message: (props) => `${props.value} is not a valid GitHub profile URL!`,
      },
    },
    password: { 
      type: String, 
      required: true,
      minlength: [6, "Password must be at least 6 characters long"]
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      required: false, 
    },
    // ✅ New field for profile image
    profileImage: {
      type: String, // Store image path
      default: "", // Default is empty
    },
  },
  { timestamps: true }
);

// Check if the model exists before creating it
module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);
