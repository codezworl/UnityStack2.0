const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
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
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes for optimizing queries
reviewSchema.index({ projectId: 1 });
reviewSchema.index({ reviewerId: 1 });
reviewSchema.index({ rating: 1 });

// Static method to get average rating for a project
reviewSchema.statics.getAverageRating = async function(projectId) {
  const result = await this.aggregate([
    { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
    { $group: { _id: null, averageRating: { $avg: "$rating" } } }
  ]);
  return result[0]?.averageRating || 0;
};

// Pre-save middleware to update project's average rating
reviewSchema.pre('save', async function(next) {
  try {
    const Project = mongoose.model('Project');
    const averageRating = await this.constructor.getAverageRating(this.projectId);
    
    await Project.findByIdAndUpdate(this.projectId, {
      averageRating: averageRating
    });
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
