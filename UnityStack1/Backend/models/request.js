const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userRole: {
    type: String,
    enum: ['student', 'developer'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  requestedTimeSlot: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  originalSessionDate: {
    type: Date,
    required: true
  },
  originalSessionTime: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Request || mongoose.model('Request', requestSchema); 