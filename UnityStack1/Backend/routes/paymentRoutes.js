const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Payment = require('../models/Payment');

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

    // Check if payment already completed
    const existingPayment = await Payment.findOne({ projectId });
    if (existingPayment && existingPayment.status === 'completed') {
      return res.status(400).json({ message: 'Payment already completed for this project' });
    }

    let payment;
    if (existingPayment) {
      payment = await Payment.findByIdAndUpdate(
        existingPayment._id,
        {
          status: 'completed',
          amount: amount,
          paymentDate: new Date()
        },
        { new: true }
      );
    } else {
      payment = new Payment({
        userId: req.user._id,
        projectId,
        developerId,
        amount,
        status: 'completed',
        paymentDate: new Date(),
        paymentIntentId: `simple_${Date.now()}`
      });
      await payment.save();
    }

    // Update project: set payment status to paid and status to in-progress
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        paymentStatus: 'paid',
        paymentDate: new Date(),
        status: 'in-progress', // Change from "assigned" to "in-progress" after payment
        startDate: new Date() // Set start date when payment is made
      },
      { new: true }
    );

    if (!updatedProject) {
      await Payment.findByIdAndUpdate(payment._id, { status: 'failed' });
      return res.status(500).json({ message: 'Failed to update project status' });
    }

    console.log("Payment completed, project status updated to in-progress");

    res.json({ 
      success: true, 
      message: 'Payment completed successfully', 
      payment, 
      project: updatedProject 
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
});

module.exports = router;
