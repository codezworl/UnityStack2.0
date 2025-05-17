const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/admincontroller');
const authenticateToken = require('../middleware/auth');

// Admin login
router.post('/login', adminController.login);

// Get dashboard statistics
router.get('/stats', authenticateToken, adminController.getDashboardStats);

// Get today's activities
router.get('/today-activities', authenticateToken, adminController.getTodayActivities);

// User management routes
router.get('/users', authenticateToken, adminController.getAllUsers);
router.delete('/users/:role/:userId', authenticateToken, adminController.deleteUser);
router.put('/users/:role/:userId', authenticateToken, adminController.updateUser);

module.exports = router;
