const mongoose = require('mongoose');

const projectSubmissionSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  submitterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  submitterName: {
    type: String,
    required: true
  },
  submitterRole: {
    type: String,
    enum: ['developer', 'organization', 'student'],
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
  files: [{
    filename: String,
    originalname: String,
    path: String,
    mimetype: String
  }],
  links: [{
    url: String,
    description: String
  }],
  images: [{
    filename: String,
    originalname: String,
    path: String,
    mimetype: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  feedback: {
    type: String
  },
  rejectionDetails: {
    issues: [{
      type: String,
      enum: ['zipFile', 'docFile', 'link', 'description']
    }],
    message: String,
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'rejectionDetails.rejectedByRole'
    },
    rejectedByRole: {
      type: String,
      enum: ['developer', 'organization', 'student']
    },
    rejectedAt: {
      type: Date,
      default: Date.now
    }
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Pre-save middleware to update project status
projectSubmissionSchema.pre('save', async function(next) {
  try {
    if (this.isModified('status')) {
      console.log('Updating project status from submission:', {
        projectId: this.projectId,
        submissionStatus: this.status
      });

      // Get the Project model using mongoose.model() to avoid circular dependency
      const Project = mongoose.model('Project');
      const project = await Project.findById(this.projectId);
      
      if (!project) {
        console.error('Project not found:', this.projectId);
        return next(new Error('Project not found'));
      }

      // Update project status based on submission status
      if (this.status === 'approved') {
        project.status = 'completed';
        project.completionDate = new Date();
      } else if (this.status === 'rejected') {
        project.status = 'rejected';
      }

      await project.save();
      console.log('Project status updated successfully:', project.status);
    }
    next();
  } catch (error) {
    console.error('Error in pre-save middleware:', error);
    next(error);
  }
});

// Post-save middleware to update project reference
projectSubmissionSchema.post('save', async function() {
  try {
    const Project = mongoose.model('Project');
    await Project.findByIdAndUpdate(this.projectId, {
      submission: this._id
    });
  } catch (error) {
    console.error('Error updating project submission reference:', error);
  }
});

module.exports = mongoose.model('ProjectSubmission', projectSubmissionSchema);
