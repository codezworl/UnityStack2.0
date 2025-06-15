require('dotenv').config();
//stripe
const Project = require('../models/Project');
const Payment = require('../models/Payment');

// Create a payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, projectId, developerId } = req.body;

    if (!amount || !projectId || !developerId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents and ensure it's an integer
      currency: 'usd', // Change to USD since we're converting PKR to USD
      metadata: {
        projectId,
        developerId
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    // Send more detailed error information
    res.status(500).json({ 
      message: 'Error creating payment intent',
      error: error.message,
      details: error.type || 'Unknown error'
    });
  }
};

// Handle successful payment
const handleStripePaymentSuccess = async (req, res) => {
  try {
    const { projectId, paymentIntentId, amount, developerId } = req.body;

    // Create payment record with all required fields
    const payment = new Payment({
      projectId,
      developerId,
      amount,
      paymentIntentId,
      status: 'paid', // Changed from 'completed' to 'paid' to match enum
      paymentDate: new Date(),
      payerType: 'organization', // Assuming the payer is an organization
      payeeType: 'developer', // Assuming the payee is a developer
      netAmount: amount, // Using the same amount as netAmount
      currency: 'USD', // Since we're using Stripe which processes in USD
      paymentMethod: 'card' // Since we're using Stripe card payments
    });
    await payment.save();

    // Update project status
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        paymentStatus: 'paid',
        status: 'in-progress',
        startDate: new Date()
      },
      { new: true }
    );

    if (!updatedProject) {
      await Payment.findByIdAndUpdate(payment._id, { status: 'failed' });
      return res.status(500).json({ message: 'Failed to update project status' });
    }

    res.json({
      success: true,
      message: 'Payment processed successfully',
      payment,
      project: updatedProject
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ 
      message: 'Error processing payment',
      error: error.message 
    });
  }
};

// Handle Stripe webhook events
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      'whsec_your_webhook_secret' // Replace with your actual webhook secret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const { projectId, developerId } = paymentIntent.metadata;
        
        // Update payment and project status
        await Payment.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          { status: 'completed' }
        );

        await Project.findByIdAndUpdate(projectId, {
          paymentStatus: 'paid',
          status: 'in-progress',
          startDate: new Date()
        });
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await Payment.findOneAndUpdate(
          { paymentIntentId: failedPayment.id },
          { status: 'failed' }
        );
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ message: 'Error processing webhook' });
  }
};

const handleSessionPaymentSuccess = async (req, res) => {
  try {
    const { sessionId, paymentIntentId, amount, studentId, developerId } = req.body;

    const payment = new Payment({
      sessionId,
      studentId,
      developerId,
      amount,
      paymentIntentId,
      status: 'paid',
      paymentDate: new Date(),
      payerType: 'student',
      payeeType: 'developer',
      netAmount: amount,
      currency: 'USD',
      paymentMethod: 'card'
    });
    await payment.save();

    res.json({
      success: true,
      message: 'Session payment processed successfully',
      payment
    });
  } catch (error) {
    console.error('Error processing session payment:', error);
    res.status(500).json({ message: 'Error processing session payment' });
  }
};

module.exports = {
  createPaymentIntent,
  handleStripePaymentSuccess,
  handleStripeWebhook,
  handleSessionPaymentSuccess
}; 