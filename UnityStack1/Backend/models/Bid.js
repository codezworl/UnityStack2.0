const mongoose = require('mongoose');
const Organization = require('./Organization');
const Developer = require('./Develpor'); // This is correct as the file is named Develpor.js

// Define the Bid Schema
const bidSchema = new mongoose.Schema({
  // Reference to the bidder, dynamically resolving based on the userRole field
  bidderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userRole',  // Dynamically resolves to either 'Developer' or 'Organization'
  },
  // The amount being bid for the project
  amount: {
    type: Number,
    required: true,
  },
  // A written proposal from the bidder
  proposal: {
    type: String,
    required: true,
  },
  // The status of the bid, can be pending, accepted, or rejected
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  // The timestamp when the bid was submitted
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  // Name of the bidder (used for display purposes)
  userName: {
    type: String,
    required: true,
  },
  // The role of the bidder (either 'developer' or 'organization')
  userRole: {
    type: String,
    required: true,
    enum: ['developer', 'Organization'],  // Changed 'developer' to 'Developer' and 'organization' to 'Organization'
  },
  // Reference to the project that the bid is associated with
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', // Reference to the Project model
    required: true,
  }
}, { timestamps: true });

// Ensure the model is correctly exported with the name 'Bid'
module.exports = mongoose.model('Bid', bidSchema);
