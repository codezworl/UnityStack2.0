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
    dateOfBirth: { type: Date }, // Using Date type for date of birth
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    experience: { type: String, trim: true }, // Keep as string unless numerical operations are needed
    domainTags: [{ type: String, trim: true }], // Array of technology domains or tags
    github: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return v ? /^(https?:\/\/)?(www\.)?github\.com\/.*$/.test(v) : true; // GitHub URL validation
        },
        message: (props) => `${props.value} is not a valid GitHub profile URL!`,
      },
    },
    linkedIn: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return v ? /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/.test(v) : true; // LinkedIn URL validation
        },
        message: (props) => `${props.value} is not a valid LinkedIn profile URL!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("Developer", developerSchema);
