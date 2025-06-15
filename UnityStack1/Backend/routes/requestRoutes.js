const express = require('express');
const router = express.Router();
const Request = require('../models/request');
const Session = require('../models/session');
const authenticateToken = require('../middleware/auth');

// Get all requests (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const requests = await Request.find()
      .populate({
        path: 'sessionId',
        populate: [
          {
            path: 'developerId',
            select: 'firstName lastName email'
          },
          {
            path: 'studentId',
            select: 'firstName lastName email'
          }
        ]
      })
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

// Create a new rescheduling request
router.post('/create', authenticateToken, async (req, res) => {
  try {
    console.log('Create request received:', req.body);
    console.log('User data:', req.user);

    const { sessionId, reason, requestedTimeSlot, userRole, requestedBy, originalSessionDate, originalSessionTime } = req.body;
    
    // Validate required fields
    if (!sessionId || !reason || !requestedTimeSlot || !userRole || !requestedBy || !originalSessionDate || !originalSessionTime) {
      console.log('Missing required fields:', {
        sessionId: !!sessionId,
        reason: !!reason,
        requestedTimeSlot: !!requestedTimeSlot,
        userRole: !!userRole,
        requestedBy: !!requestedBy,
        originalSessionDate: !!originalSessionDate,
        originalSessionTime: !!originalSessionTime
      });
      return res.status(400).json({ 
        message: 'Missing required fields',
        details: {
          sessionId: !!sessionId,
          reason: !!reason,
          requestedTimeSlot: !!requestedTimeSlot,
          userRole: !!userRole,
          requestedBy: !!requestedBy,
          originalSessionDate: !!originalSessionDate,
          originalSessionTime: !!originalSessionTime
        }
      });
    }

    // Get the original session
    const session = await Session.findById(sessionId);
    if (!session) {
      console.log('Session not found:', sessionId);
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify user is either the developer or student of this session
    if (userRole === 'developer' && session.developerId.toString() !== requestedBy) {
      console.log('Developer authorization failed:', {
        userRole,
        requestedBy,
        sessionDeveloperId: session.developerId.toString()
      });
      return res.status(403).json({ message: 'Not authorized to create request for this session' });
    }
    if (userRole === 'student' && session.studentId.toString() !== requestedBy) {
      console.log('Student authorization failed:', {
        userRole,
        requestedBy,
        sessionStudentId: session.studentId.toString()
      });
      return res.status(403).json({ message: 'Not authorized to create request for this session' });
    }

    // Create the request
    const request = new Request({
      sessionId,
      requestedBy,
      userRole,
      reason,
      requestedTimeSlot,
      originalSessionDate,
      originalSessionTime
    });

    console.log('Creating request with data:', request);

    await request.save();
    console.log('Request saved successfully:', request._id);

    res.status(201).json({ message: 'Request created successfully', request });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ 
      message: 'Error creating request',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get requests for a session
router.get('/session/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userData = req.user;

    // Get the session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify user is either the developer or student of this session
    if (userData.role === 'developer' && session.developerId.toString() !== userData.id) {
      return res.status(403).json({ message: 'Not authorized to view requests for this session' });
    }
    if (userData.role === 'student' && session.studentId.toString() !== userData.id) {
      return res.status(403).json({ message: 'Not authorized to view requests for this session' });
    }

    const requests = await Request.find({ sessionId }).sort({ createdAt: -1 });
    res.json({ requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

// Update request status
router.put('/:requestId/status', authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const userData = req.user;

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Get the session
    const session = await Session.findById(request.sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify user is either the developer or student of this session
    if (userData.role === 'developer' && session.developerId.toString() !== userData.id) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }
    if (userData.role === 'student' && session.studentId.toString() !== userData.id) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    request.status = status;
    await request.save();

    res.json({ message: 'Request status updated successfully', request });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Error updating request status' });
  }
});

// Approve rescheduling request (admin only)
router.put('/:requestId/approve', authenticateToken, async (req, res) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { requestId } = req.params;
    const { newTimeSlot, newDate } = req.body;

    if (!newTimeSlot || !newDate) {
      return res.status(400).json({ message: 'New time slot and date are required' });
    }

    const request = await Request.findById(requestId)
      .populate('sessionId');
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Update session with new time and date
    const session = await Session.findById(request.sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Update session time and date
    session.startTime = newTimeSlot.split(' - ')[0];
    session.endTime = newTimeSlot.split(' - ')[1];
    session.date = new Date(newDate);
    await session.save();

    // Update request status
    request.status = 'approved';
    request.newTimeSlot = newTimeSlot;
    request.newDate = newDate;
    await request.save();

    res.json({ 
      message: 'Request approved and session rescheduled successfully',
      request,
      session
    });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ 
      message: 'Error approving request',
      error: error.message 
    });
  }
});

// Reject rescheduling request (admin only)
router.put('/:requestId/reject', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { requestId } = req.params;
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is not pending' });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Request rejected', request });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Error rejecting request' });
  }
});

module.exports = router; 