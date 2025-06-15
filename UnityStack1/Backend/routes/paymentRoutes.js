const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Payment = require('../models/Payment');
const { createPaymentIntent, handleStripePaymentSuccess, handleStripeWebhook, handleSessionPaymentSuccess } = require('../Controllers/paymentcontroller');

// Stripe payment routes
router.post('/create-payment-intent', auth, createPaymentIntent);
router.post('/confirm-payment', auth, handleStripePaymentSuccess);
router.post('/payment-success', auth, handleStripePaymentSuccess);
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Simple payment without Stripe
router.post('/simple-payment', auth, async (req, res) => {
  try {
    const { projectId, amount, developerId } = req.body;

    if (!projectId || !amount || !developerId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Create payment record
    const payment = new Payment({
      projectId,
      developerId,
      amount,
      status: 'completed',
      paymentDate: new Date()
    });
    await payment.save();

    // Update project status
    project.paymentStatus = 'paid';
    project.status = 'in-progress';
    project.startDate = new Date();
    await project.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      payment,
      project
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
});

router.post('/session-payment', auth, handleSessionPaymentSuccess);

module.exports = router;