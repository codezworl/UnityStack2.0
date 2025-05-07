const mongoose = require('mongoose');
const Organization = require('./Organization');
const Bid = require('../models/Bid');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',  // ✅ Fix: Use capital 'O' to match model registration
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  budget: {
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  file: {
    type: String
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'in-progress', 'completed', 'cancelled', 'closed'],
    default: 'open'
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  bids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'  // Reference to the Bid model
  }],
  assignedDeveloper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer'  // Reference to the Developer model
  },
  assignedDate: {
    type: Date
  },
  completionDate: {
    type: Date
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'released'],
    default: 'pending'
  },
  paymentDate: {
    type: Date
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  startDate: {
    type: Date
  }
}, { timestamps: true });

// Pre-save middleware to handle project assignment
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.lastUpdate = Date.now();

  if (this.assignedDeveloper && this.status === 'open') {
    this.status = 'assigned';
    this.isVisible = false;
    this.assignedDate = this.assignedDate || new Date();
  }

  next();
});

// Indexes for optimizing queries
projectSchema.index({ status: 1, companyId: 1 });
projectSchema.index({ assignedDeveloper: 1 });

module.exports = mongoose.model('Project', projectSchema);
