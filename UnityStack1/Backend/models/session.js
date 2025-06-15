const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  hours: {
    type: Number,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'released'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String
  },
  recordingPath: {
    type: String
  },
  withdrawalInfo: {
    bankName: String,
    accountNumber: String,
    accountHolderName: String,
    swiftCode: String,
    routingNumber: String,
    withdrawalDate: Date
  }
}, {
  timestamps: true
});

// Check if the model exists before creating it
module.exports = mongoose.models.Session || mongoose.model('Session', sessionSchema);
