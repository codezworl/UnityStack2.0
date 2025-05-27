const Review = require('../models/review');
const Project = require('../models/Project');
const Notification = require('../models/notification');

// Create a new review
const createReview = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { rating, description, reviewerRole } = req.body;
    const userId = req.user._id;

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Verify user is authorized to create review (must be project owner or assigned developer)
    let isAuthorized = false;
    if (reviewerRole === 'organization' && project.companyId && project.companyId.toString() === userId.toString()) {
      isAuthorized = true;
    } else if (reviewerRole === 'student' && project.userId && project.userId.toString() === userId.toString()) {
      isAuthorized = true;
    } else if (reviewerRole === 'developer' && project.developerId && project.developerId.toString() === userId.toString()) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to create review for this project' });
    }

    // Check if project is completed
    if (project.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed projects' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ projectId });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this project' });
    }

    // Get reviewer name based on role
    let reviewerName = '';
    if (reviewerRole === 'organization') {
      reviewerName = req.user.companyName || 'Unknown Organization';
    } else if (reviewerRole === 'student') {
      reviewerName = `${req.user.firstName} ${req.user.lastName}` || 'Unknown Student';
    } else if (reviewerRole === 'developer') {
       reviewerName = `${req.user.firstName} ${req.user.lastName}` || 'Unknown Developer';
    }

    // Create the review with correct field names
    const review = new Review({
      projectId,
      reviewerId: userId,
      reviewerRole,
      reviewerName,
      rating,
      description
    });

    await review.save();

    // Create notification for the developer (if reviewer is organization/student)
    // or for the project owner (if reviewer is developer)
    let notificationUserId = null;
    let notificationMessage = '';
    let notificationType = 'new_review';

    if (reviewerRole === 'organization' || reviewerRole === 'student') {
        notificationUserId = project.developerId;
        notificationMessage = `You received a new review for project: ${project.title}`;
    } else if (reviewerRole === 'developer') {
        notificationUserId = project.companyId || project.userId; // Notify the project owner
        notificationMessage = `A developer reviewed project: ${project.title}`;
    }

    if (notificationUserId) {
        await Notification.create({
            organization: notificationUserId,
            title: notificationType,
            message: notificationMessage,
            type: 'info',
            link: project._id ? `/project/${project._id}` : null
        });
    }

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

// Get review for a specific project
const getProjectReview = async (req, res) => {
  try {
    const { projectId } = req.params;
    const review = await Review.findOne({ projectId });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Error fetching review', error: error.message });
  }
};

// Get all reviews for a user (developer/organization)
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const reviews = await Review.find({ 
      reviewerId: userId
    }).populate('projectId', 'title description');

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Get all reviews for assigned projects
const getAssignedProjectReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching reviews for projects assigned to developer:', userId);
    
    // Find all projects where this developer is assigned
    const projects = await Project.find({ 
      assignedDeveloper: userId
    });
    console.log('Found assigned projects:', projects.length);

    // Get all project IDs
    const projectIds = projects.map(project => project._id);
    console.log('Project IDs:', projectIds);

    // Find all reviews for these projects where reviewer is NOT the developer
    const reviews = await Review.find({
      projectId: { $in: projectIds },
      reviewerRole: { $ne: 'developer' }  // Only get reviews from clients/organizations
    }).populate('projectId', 'title description');
    
    console.log('Found reviews:', reviews.length);

    // Log the actual query and results for debugging
    console.log('Review query:', {
      projectIds: projectIds,
      foundReviews: reviews.map(r => ({
        projectId: r.projectId,
        rating: r.rating,
        reviewerRole: r.reviewerRole
      }))
    });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    console.log('Calculated average rating:', averageRating);

    // Calculate rating distribution
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };
    console.log('Rating distribution:', ratingDistribution);

    res.status(200).json({
      reviews,
      stats: {
        totalReviews: reviews.length,
        averageRating: averageRating,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching assigned project reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Add a test review for debugging
const addTestReview = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;

    // Create a test review
    const review = new Review({
      projectId,
      reviewerId: userId,
      reviewerRole: 'organization',
      reviewerName: 'Test Organization',
      rating: 5,
      description: 'This is a test review to verify the review system is working correctly.'
    });

    await review.save();
    console.log('Test review created:', review);

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating test review:', error);
    res.status(500).json({ message: 'Error creating test review', error: error.message });
  }
};

module.exports = {
  createReview,
  getProjectReview,
  getUserReviews,
  getAssignedProjectReviews,
  addTestReview
}; 