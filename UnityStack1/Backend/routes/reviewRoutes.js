const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { createReview, getProjectReview, getUserReviews, getAssignedProjectReviews, addTestReview } = require('../Controllers/ReviewController');

// Create a new review
router.post('/:projectId', authenticateToken, createReview);

// Get review for a specific project
router.get('/project/:projectId', authenticateToken, getProjectReview);

// Get all reviews for the authenticated user
router.get('/user', authenticateToken, getUserReviews);

// Get all reviews for assigned projects
router.get('/assigned', authenticateToken, getAssignedProjectReviews);

// Add a test review (for debugging)
router.post('/test/:projectId', authenticateToken, addTestReview);

module.exports = router; 