const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { 
  createReview, 
  getProjectReview, 
  getUserReviews, 
  getAssignedProjectReviews, 
  addTestReview,
  getReviews,
  getAverageRating,
  getAssignedSessionReviews,
  getDeveloperRatings,
  getOrganizationRatings,
  addTestOrganizationReview
} = require('../Controllers/ReviewController');

// Create a new review (for both projects and sessions)
router.post('/', authenticateToken, createReview);

// Get all reviews for assigned projects
router.get('/assigned', authenticateToken, getAssignedProjectReviews);

// Get all reviews for assigned sessions
router.get('/sessions', authenticateToken, getAssignedSessionReviews);

// Get all reviews for a user (developer/organization)
router.get('/user', authenticateToken, getUserReviews);

// Get review for a specific project
router.get('/project/:projectId', authenticateToken, getProjectReview);

// Get average rating for a project or session
router.get('/average/:projectId?/:sessionId?', authenticateToken, getAverageRating);

// Get ratings and reviews for a specific developer (public endpoint)
router.get('/developer/:developerId', getDeveloperRatings);

// Get ratings and reviews for a specific organization (public endpoint)
router.get('/organization/:organizationId', getOrganizationRatings);

// Add a test review for debugging
router.post('/test/:projectId', authenticateToken, addTestReview);

// Add a test review for organization debugging
router.post('/test-organization/:organizationId', authenticateToken, addTestOrganizationReview);

// Get reviews for a project or session (this should be last to avoid conflicts)
router.get('/:projectId?/:sessionId?', authenticateToken, getReviews);

module.exports = router; 