const mongoose = require('mongoose');
const Organization = require('./Organization');
const Bid = require('../models/Bid');
const ProjectSubmission = require('./projectsubmission');

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
  // Fields for organization/company
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  companyName: {
    type: String
  },
  // Fields for developer
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer'
  },
  developerName: {
    type: String
  },
  // Fields for other users (students, etc.)
  userId: {
    type: mongoose.Schema.Types.ObjectId
  },
  userName: {
    type: String
  },
  // Track who created the project
  createdBy: {
    type: String,
    enum: ['Organization', 'Developer', 'Student'],
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
  type: {
    type: String,
    enum: ['Full Stack Project', 'Front End', 'Back End', 'API', 'Mobile App', 'Other'],
    default: 'Full Stack Project'
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'in-progress', 'completed', 'cancelled', 'closed', 'submitted', 'rejected'],
    default: 'open'
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  bids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  }],
  assignedDeveloper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer'
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
  },
  acceptedBid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid'
  },
  acceptedBidAmount: {
    type: Number
  },
  submission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectSubmission'
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

// Static method to update project status from submission
projectSchema.statics.updateStatusFromSubmission = async function(projectId, submissionStatus) {
  try {
    console.log('Finding project:', projectId);
    const project = await this.findById(projectId);
    if (!project) {
      console.error('Project not found:', projectId);
      return null;
    }

    console.log('Current project status:', project.status);
    let newStatus = project.status;
    
    if (submissionStatus === 'rejected') {
      newStatus = 'rejected';
    } else if (submissionStatus === 'approved') {
      newStatus = 'completed';
    } else if (submissionStatus === 'pending') {
      newStatus = 'submitted';
    }

    console.log('Updating project status:', {
      from: project.status,
      to: newStatus,
      submissionStatus
    });

    if (newStatus !== project.status) {
      project.status = newStatus;
      project.lastUpdate = new Date();
      if (newStatus === 'completed') {
        project.completionDate = new Date();
      }
      
      // Save with validation
      await project.save({ validateBeforeSave: true });
      console.log('Project status updated successfully');
    } else {
      console.log('Project status unchanged');
    }

    return project;
  } catch (error) {
    console.error('Error updating project status:', error);
    throw error;
  }
};


// Indexes for optimizing queries
projectSchema.index({ status: 1 });
projectSchema.index({ companyId: 1 });
projectSchema.index({ developerId: 1 });
projectSchema.index({ userId: 1 });
projectSchema.index({ assignedDeveloper: 1 });

module.exports = mongoose.model('Project', projectSchema);
