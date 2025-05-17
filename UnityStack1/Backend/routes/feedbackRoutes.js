const express = require('express');
const router = express.Router();
const feedbackController = require('../Controllers/feedbackController');
const authenticateToken = require('../middleware/auth');

// Public routes
router.post('/submit', feedbackController.submitFeedback);

// Protected routes (admin only)
router.get('/all', authenticateToken, feedbackController.getFeedbacks);
router.get('/unseen-count', authenticateToken, feedbackController.getUnseenFeedbackCount);
router.put('/mark-seen/:feedbackId', authenticateToken, feedbackController.markFeedbackAsSeen);
router.put('/mark-all-seen', authenticateToken, feedbackController.markAllAsSeen);
router.get('/recent', authenticateToken, feedbackController.getRecentFeedbacks);

module.exports = router; 