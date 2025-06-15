const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController');
const authenticateToken = require('../middleware/auth');

// Get user's notifications
router.get('/', authenticateToken, notificationController.getNotifications);

// Mark a notification as read
router.put('/:notificationId/read', authenticateToken, notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', authenticateToken, notificationController.markAllAsRead);

module.exports = router; 