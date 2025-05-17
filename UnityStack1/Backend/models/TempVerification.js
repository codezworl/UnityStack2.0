const mongoose = require("mongoose");

// Schema for temporary verification codes
const tempVerificationSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    verificationCode: { 
      type: String, 
      required: true 
    },
    expiresAt: { 
      type: Date, 
      required: true,
      default: () => new Date(+new Date() + 10*60*1000) // 10 minutes from now
    }
  },
  { timestamps: true }
);

// Automatically remove expired verification codes
tempVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("TempVerification", tempVerificationSchema); 