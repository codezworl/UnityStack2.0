const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Payment = require('../models/Payment');

// Create a payment intent
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { amount, projectId, developerId } = req.body;

    // Validate input
    if (!amount || !projectId || !developerId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if project exists and is not already assigned
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.status === 'assigned') {
      return res.status(400).json({ message: 'Project is already assigned' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents and ensure it's an integer
      currency: 'pkr',
      metadata: {
        projectId,
        developerId,
        userId: req.user.id
      },
      payment_method_types: ['card'],
      description: `Payment for project: ${project.title}`,
      receipt_email: req.user.email // Optional: Send receipt to user's email
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      currency: 'pkr'
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating payment intent' });
  }
});

// Handle successful payment
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { paymentIntentId, projectId, developerId, amount } = req.body;

    // Validate input
    if (!paymentIntentId || !projectId || !developerId || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify the payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ paymentIntentId });
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already processed' });
    }

    // Create payment record
    const payment = new Payment({
      userId: req.user.id,
      projectId,
      developerId,
      amount,
      paymentIntentId,
      status: 'completed'
    });
    await payment.save();

    // Update project status
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        status: 'assigned',
        assignedTo: developerId,
        paymentStatus: 'paid',
        paymentDate: new Date()
      },
      { new: true }
    );

    if (!updatedProject) {
      // If project update fails, mark payment as failed
      await Payment.findByIdAndUpdate(payment._id, { status: 'failed' });
      return res.status(500).json({ message: 'Failed to update project status' });
    }

    res.json({ 
      success: true, 
      payment,
      project: updatedProject
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error confirming payment' });
  }
});

// Get payment history for a user
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate('projectId', 'title description')
      .populate('developerId', 'userName email')
      .sort({ createdAt: -1 });

    res.json({ payments });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
});

module.exports = router; 