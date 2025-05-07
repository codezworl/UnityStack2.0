const mongoose = require('mongoose');

const projectHistorySchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  projectTitle: {
    type: String,
    required: true
  },
  action: {
    type: String,
    enum: ['closed', 'deleted'],
    required: true
  },
  details: {
    type: String,
    required: true
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  performedByRole: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ProjectHistory', projectHistorySchema); 