const Session = require('../models/session');
const Developer = require('../models/Develpor');
const Student = require('../models/Student');
const stripe = require('stripe')('sk_test_51RL6m0I2RrNQfuPD29j3kdCvJipd40GFcCn7UXAKYPaRlezurQvoTTE69qHYWQUSceruHENCh8BBR3m9AmJotT4d00wWusM9Lr');
const notificationController = require('./notificationController');

// Get available time slots for a developer
exports.getAvailableTimeSlots = async (req, res) => {
  try {
    const { developerId, date } = req.query;
    const developer = await Developer.findById(developerId);
    
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    // Debug log for workingHours
    console.log('Developer workingHours:', developer.workingHours);

    // Fallback: parse workingHours if it's a string
    let workingHours = developer.workingHours;
    if (typeof workingHours === 'string') {
      try {
        workingHours = JSON.parse(workingHours);
      } catch (e) {
        workingHours = null;
      }
    }

    if (!workingHours || !workingHours.from || !workingHours.to) {
      return res.status(400).json({ message: 'Developer has not set working hours' });
    }

    // Get booked sessions for the date
    const bookedSessions = await Session.find({
      developerId,
      date: new Date(date),
      status: { $in: ['pending', 'confirmed'] }
    });
    console.log('Booked sessions for this date:', bookedSessions);

    // Calculate available time slots for N-hour blocks
    const requestedHours = parseInt(req.query.hours) || 1;
    let startHour = parseInt(workingHours.from.split(':')[0]);
    let endHour = parseInt(workingHours.to.split(':')[0]);
    if (endHour === 0) endHour = 24; // treat 00:00 as 24 for easier math

    // Build all possible N-hour blocks
    let slotStarts = [];
    if (endHour > startHour) {
      for (let hour = startHour; hour <= endHour - requestedHours; hour++) {
        slotStarts.push(hour);
      }
    } else if (endHour < startHour) {
      // Crosses midnight
      for (let hour = startHour; hour < 24; hour++) {
        if (hour + requestedHours <= 24) slotStarts.push(hour);
      }
      for (let hour = 0; hour <= endHour - requestedHours; hour++) {
        slotStarts.push(hour);
      }
    }

    // Improved overlap logic
    function isBlockFree(start, hours) {
      // Build the full range for the requested block
      const blockRange = [];
      for (let h = 0; h < hours; h++) {
        blockRange.push((start + h) % 24);
      }
      // Check against all booked sessions
      for (const session of bookedSessions) {
        let sessionStart = parseInt(session.startTime.split(':')[0]);
        let sessionEnd = parseInt(session.endTime.split(':')[0]);
        if (sessionEnd === 0) sessionEnd = 24;
        let sessionRange = [];
        if (sessionEnd > sessionStart) {
          for (let h = sessionStart; h < sessionEnd; h++) sessionRange.push(h);
        } else if (sessionEnd < sessionStart) {
          for (let h = sessionStart; h < 24; h++) sessionRange.push(h);
          for (let h = 0; h < sessionEnd; h++) sessionRange.push(h);
        }
        // If any hour in blockRange is in sessionRange, block it
        if (blockRange.some(hr => sessionRange.includes(hr))) return false;
      }
      return true;
    }

    const availableSlots = slotStarts
      .filter(hour => isBlockFree(hour, requestedHours))
      .map(hour => {
        const end = (hour + requestedHours) % 24;
        return `${hour}:00 - ${end === 0 ? '00' : end}:00`;
      });

    res.json({
      workingHours: workingHours,
      availableSlots,
      hourlyRate: developer.hourlyRate
    });
  } catch (error) {
    console.error('Error getting time slots:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const {
      developerId,
      title,
      description,
      hours,
      startTime,
      date,
      amount
    } = req.body;

    const studentId = req.user.id; // From auth middleware

    // Calculate end time
    const startHour = parseInt(startTime.split(':')[0]);
    const endTime = `${startHour + hours}:00`;

    // Create payment intent
    const PKR_TO_USD = 280;
    const usdAmount = Math.round((amount / PKR_TO_USD) * 100); // Convert to cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount: usdAmount,
      currency: 'usd',
      metadata: {
        studentId,
        developerId,
        sessionTitle: title
      }
    });

    // Create session
    const session = new Session({
      studentId,
      developerId,
      title,
      description,
      hours,
      startTime,
      endTime,
      date: new Date(date),
      amount,
      paymentIntentId: paymentIntent.id
    });

    await session.save();

    // Create notification for session booking
    await notificationController.createSessionNotifications(session._id, 'session_booked');

    res.json({
      session,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Confirm session payment
exports.confirmSessionPayment = async (req, res) => {
  try {
    const { sessionId, paymentIntentId } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    session.paymentStatus = 'completed';
    session.status = 'confirmed';
    await session.save();

    res.json({ message: 'Session payment confirmed successfully' });
  } catch (error) {
    console.error('Error confirming session payment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check if student already has a pending/confirmed session with this developer
exports.hasActiveSessionWithDeveloper = async (req, res) => {
  try {
    const { studentId, developerId } = req.query;
    const session = await Session.findOne({
      studentId,
      developerId,
      status: { $in: ['pending', 'confirmed'] }
    });
    res.json({ hasActiveSession: !!session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all sessions for a student
exports.getStudentSessions = async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) {
      return res.status(400).json({ message: 'studentId is required' });
    }
    const sessions = await Session.find({ studentId })
      .populate('developerId', 'firstName lastName');
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all sessions for a developer
exports.getDeveloperSessions = async (req, res) => {
  try {
    const developerId = req.user._id;
    console.log('Fetching sessions for developer:', developerId);
    
    if (!developerId) {
      return res.status(400).json({ message: 'Developer ID is required' });
    }

    const sessions = await Session.find({ developerId })
      .populate('studentId', 'firstName lastName')
      .sort({ date: -1 }); // Sort by date descending
    
    console.log('Found sessions:', sessions.length);
    
    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching developer sessions:', error);
    res.status(500).json({ 
      message: 'Error fetching developer sessions', 
      error: error.message 
    });
  }
};

// Get session details by ID
exports.getSessionDetail = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId)
      .populate('developerId', 'firstName lastName')
      .populate('studentId', 'firstName lastName');
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json({ session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Withdraw session earnings
exports.withdrawSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { bankName, accountNumber, accountHolderName, swiftCode, routingNumber } = req.body;
    const developerId = req.user.id; // From auth middleware

    // Validate required fields
    if (!bankName || !accountNumber || !accountHolderName || !swiftCode || !routingNumber) {
      return res.status(400).json({ message: 'All bank details are required' });
    }

    // Find the session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify the developer is authorized to withdraw
    if (session.developerId.toString() !== developerId) {
      return res.status(403).json({ message: 'Not authorized to withdraw for this session' });
    }

    // Check if session is completed
    if (session.status !== 'completed') {
      return res.status(400).json({ message: 'Session must be completed before withdrawal' });
    }

    // Check if payment is completed
    if (session.paymentStatus !== 'completed') {
      return res.status(400).json({ message: 'Session payment must be completed before withdrawal' });
    }

    // Check if withdrawal has already been processed
    if (session.withdrawalInfo && session.withdrawalInfo.withdrawalDate) {
      return res.status(400).json({ message: 'Withdrawal has already been processed for this session' });
    }

    // Update session with withdrawal information and change payment status to released
    session.withdrawalInfo = {
      bankName,
      accountNumber,
      accountHolderName,
      swiftCode,
      routingNumber,
      withdrawalDate: new Date()
    };
    
    // Update payment status to released
    session.paymentStatus = 'released';

    await session.save();

    res.status(200).json({
      message: 'Withdrawal request submitted successfully',
      withdrawalInfo: session.withdrawalInfo
    });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({ message: 'Error processing withdrawal request' });
  }
};

// Update session status to completed
exports.completeSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify user is either the developer or student of this session
    const userData = req.user;
    if (userData.role === 'developer' && session.developerId.toString() !== userData.id) {
      return res.status(403).json({ message: 'Not authorized to complete this session' });
    }
    if (userData.role === 'student' && session.studentId.toString() !== userData.id) {
      return res.status(403).json({ message: 'Not authorized to complete this session' });
    }

    session.status = 'completed';
    await session.save();

    // Create notification for session completion
    await notificationController.createSessionNotifications(session._id, 'session_completed');

    res.status(200).json({ message: 'Session marked as completed' });
  } catch (error) {
    console.error('Error completing session:', error);
    res.status(500).json({ message: 'Error completing session' });
  }
}; 