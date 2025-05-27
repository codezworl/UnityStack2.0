const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Developer',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'clientModel',
    required: true
  },
  clientModel: {
    type: String,
    required: true,
    enum: ['User', 'Company']
  },
  amount: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    required: true
  },
  netAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['payment', 'withdrawal'],
    required: true
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['card', 'bank_transfer'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      required: true
    },
    transactionId: {
      type: String,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
invoiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice; 