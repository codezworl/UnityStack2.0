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

// Get revenue data
router.get('/revenue', authenticateToken, adminController.getRevenueData);

// Get transactions
router.get('/transactions', authenticateToken, adminController.getTransactions);

// Release payment
router.put('/transactions/:transactionId/release', authenticateToken, adminController.releasePayment);

// Cancel payment
router.put('/transactions/:transactionId/cancel', authenticateToken, adminController.cancelPayment);

module.exports = router;
