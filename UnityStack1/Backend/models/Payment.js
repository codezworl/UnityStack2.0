const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  // For organization payments
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  // For developer payments
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer'
  },
  // For student payments
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'other'],
    default: 'card'
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  refundDate: {
    type: Date
  },
  refundReason: {
    type: String
  },
  // Track who made the payment
  payerType: {
    type: String,
    enum: ['organization', 'developer', 'student'],
    required: true
  },
  // Track who received the payment
  payeeType: {
    type: String,
    enum: ['organization', 'developer', 'student'],
    required: true
  },
  // Additional payment details
  description: {
    type: String
  },
  currency: {
    type: String,
    default: 'PKR'
  },
  platformFee: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
paymentSchema.index({ projectId: 1 });
paymentSchema.index({ organizationId: 1 });
paymentSchema.index({ developerId: 1 });
paymentSchema.index({ studentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema); 