const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  reviewerRole: {
    type: String,
    enum: ['organization', 'student', 'developer'],
    required: true
  },
  reviewerName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  reviewType: {
    type: String,
    enum: ['project', 'session'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes for optimizing queries
reviewSchema.index({ projectId: 1 });
reviewSchema.index({ sessionId: 1 });
reviewSchema.index({ reviewerId: 1 });
reviewSchema.index({ rating: 1 });

// Static method to get average rating for a project or session
reviewSchema.statics.getAverageRating = async function(id, type) {
  const field = type === 'project' ? 'projectId' : 'sessionId';
  const result = await this.aggregate([
    { $match: { [field]: new mongoose.Types.ObjectId(id) } },
    { $group: { _id: null, averageRating: { $avg: "$rating" } } }
  ]);
  return result[0]?.averageRating || 0;
};

// Pre-save middleware to update project's or session's average rating
reviewSchema.pre('save', async function(next) {
  try {
    if (this.reviewType === 'project') {
      const Project = mongoose.model('Project');
      const averageRating = await this.constructor.getAverageRating(this.projectId, 'project');
      await Project.findByIdAndUpdate(this.projectId, { averageRating });
    } else {
      const Session = mongoose.model('Session');
      const averageRating = await this.constructor.getAverageRating(this.sessionId, 'session');
      await Session.findByIdAndUpdate(this.sessionId, { averageRating });
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
