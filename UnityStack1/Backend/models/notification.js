const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'error'],
    default: 'info'
  },
  read: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema); 