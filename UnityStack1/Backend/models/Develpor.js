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
    phoneNumber: { 
      type: String, 
      trim: true,
      required: true,
      validate: {
        validator: function(v) {
          // Format XXXX-XXXXXXX
          return /^\d{4}-\d{7}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number format! Use XXXX-XXXXXXX`
      }
    },
    homeNumber: { 
      type: String, 
      trim: true,
      validate: {
        validator: function(v) {
          // Format XXXX-XXXXXXX (if provided)
          return v ? /^\d{4}-\d{7}$/.test(v) : true;
        },
        message: props => `${props.value} is not a valid home number format! Use XXXX-XXXXXXX`
      }
    },
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
          return v ? /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9-]+$/.test(v) : true;
        },
        message: (props) => `${props.value} is not a valid GitHub profile URL!`,
      },
    },
    linkedIn: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return v ? /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9-]+$/.test(v) : true;
        },
        message: (props) => `${props.value} is not a valid LinkedIn profile URL!`,
      },
    },

    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
      validate: {
        validator: function(v) {
          // At least 8 characters, containing both letters and numbers
          return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(v);
        },
        message: "Password must be at least 8 characters long and contain both letters and numbers"
      }
    },

    isVerified: { type: Boolean, default: false },
    verificationCode: String,

    // ✅ Profile Fields
    profileImage: { type: String, trim: true },
    about: { type: String, trim: true },
    hourlyRate: { type: String, trim: true, default: "0" },
    workingHours: {
      from: { type: String, trim: true, default: "09:00" },
      to: { type: String, trim: true, default: "17:00" },
    },
    availability: { type: String, trim: true, default: "Offline" },

    // ✅ Expertise Section (Ensuring positive values for projects)
    expertise: [
      {
        domain: { type: String, required: true, trim: true },
        experienceYears: { type: Number, default: 0, min: 0 }, // Prevent negative experience
        projects: { type: Number, default: 0, min: 0 }, // Prevent negative projects
      },
    ],

    // ✅ Job Experience Section (Ensuring startDate <= endDate)
    employment: [
      {
        companyName: { type: String, required: true, trim: true },
        position: { type: String, required: true, trim: true },
        startDate: { type: Date, required: true },
        endDate: { 
          type: Date, 
          validate: {
            validator: function (v) {
              return !this.startDate || !v || v >= this.startDate;
            },
            message: "End date cannot be before start date!",
          },
          default: null,
        },
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Developer", developerSchema);
