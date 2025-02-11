const mongoose = require("mongoose");

// Define the schema for the Developer collection
const developerSchema = new mongoose.Schema(
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
    phoneNumber: { type: String, trim: true },
    homeNumber: { type: String, trim: true },
    dateOfBirth: { type: Date },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    experience: { type: String, trim: true },
    domainTags: [{ type: String, trim: true }],
    github: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return v ? /^(https?:\/\/)?(www\.)?github\.com\/.*$/.test(v) : true;
        },
        message: (props) => `${props.value} is not a valid GitHub profile URL!`,
      },
    },
    linkedIn: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return v ? /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/.test(v) : true;
        },
        message: (props) => `${props.value} is not a valid LinkedIn profile URL!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,

    // ✅ New Profile Setup Fields
    profileImage: { type: String, trim: true }, // Profile picture URL
    about: { type: String, trim: true }, // About Me section
    hourlyRate: { type: String, trim: true }, // Per-hour price
    availability: { type: String, trim: true }, // Availability status
    expertise: [
      {
        technology: { type: String, trim: true },
        experienceYears: { type: Number, default: 0 },
      },
    ],
    employment: [
      {
        companyName: { type: String, trim: true },
        technology: { type: String, trim: true },
        years: { type: Number, default: 0 },
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Developer", developerSchema);
