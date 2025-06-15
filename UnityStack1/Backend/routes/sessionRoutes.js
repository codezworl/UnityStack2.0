const express = require('express');
const router = express.Router();
const sessionController = require('../Controllers/sessionController');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Session = require('../models/session');
const notificationController = require('../Controllers/notificationController');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/recordings');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for video storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `session-${req.body.sessionId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024 // 1GB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept video files only
    if (!file.originalname.match(/\.(webm|mp4|mov|avi)$/)) {
      return cb(new Error('Only video files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Get available time slots
router.get('/available-slots', authenticateToken, sessionController.getAvailableTimeSlots);

// Create new session
router.post('/create', authenticateToken, sessionController.createSession);

// Confirm session payment
router.post('/confirm-payment', authenticateToken, sessionController.confirmSessionPayment);

// Check if student already has a pending/confirmed session with this developer
router.get('/student-developer-session', sessionController.hasActiveSessionWithDeveloper);

// Get all sessions for a student
router.get('/', sessionController.getStudentSessions);

// Get all sessions for a developer
router.get('/developer', authenticateToken, sessionController.getDeveloperSessions);

// Get session details by ID
router.get('/detail/:sessionId', sessionController.getSessionDetail);

// Save session recording
router.post('/save-recording', authenticateToken, upload.single('recording'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No recording file provided' });
    }

    if (!req.body.sessionId) {
      // Clean up the uploaded file if sessionId is missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Session ID is required' });
    }

    const session = await Session.findById(req.body.sessionId);
    if (!session) {
      // Clean up the uploaded file if session not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify user is either the developer or student of this session
    const userData = req.user;
    if (userData.role === 'developer' && session.developerId.toString() !== userData.id) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ message: 'Not authorized to save recording for this session' });
    }
    if (userData.role === 'student' && session.studentId.toString() !== userData.id) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ message: 'Not authorized to save recording for this session' });
    }

    // Update session with recording path
    const normalizedPath = req.file.path.replace(/\\/g, '/'); // Normalize path for Windows
    session.recordingPath = normalizedPath;
    await session.save();

    // Create notification for recording saved
    await notificationController.createSessionNotifications(session._id, 'session_completed');

    res.status(200).json({ 
      message: 'Recording saved successfully',
      recordingPath: session.recordingPath
    });
  } catch (error) {
    console.error('Error saving recording:', error);
    // Clean up the uploaded file if there's an error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
    }
    res.status(500).json({ 
      message: 'Error saving recording',
      error: error.message 
    });
  }
});

// Update session status to completed
router.put('/:sessionId/complete', authenticateToken, sessionController.completeSession);

// Add withdraw session route
router.post('/:sessionId/withdraw', authenticateToken, sessionController.withdrawSession);

module.exports = router; 