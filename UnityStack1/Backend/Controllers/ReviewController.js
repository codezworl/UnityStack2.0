const Review = require('../models/review');
const Project = require('../models/Project');
const Notification = require('../models/notification');
const Session = require('../models/session');
const Student = require('../models/Student');
const Developer = require('../models/Develpor');

// Create a new review (for both projects and sessions)
const createReview = async (req, res) => {
  try {
    const { projectId, sessionId, rating, description, reviewerRole } = req.body;
    const reviewerId = req.user._id;

    console.log('Review submission:', {
      projectId,
      sessionId,
      rating,
      description,
      reviewerRole,
      reviewerId
    });

    // Validate reviewer role
    if (!reviewerRole || !['student', 'developer', 'organization'].includes(reviewerRole)) {
      return res.status(400).json({ message: 'Invalid reviewer role' });
    }

    // Determine review type and validate
    let reviewType, targetId, project = null, session = null;
    if (projectId) {
      reviewType = 'project';
      targetId = projectId;
      project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
    } else if (sessionId) {
      reviewType = 'session';
      targetId = sessionId;
      session = await Session.findById(sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
      // Check if session is completed
      if (session.status !== 'completed') {
        return res.status(400).json({ message: 'Cannot review a session that is not completed' });
      }
    } else {
      return res.status(400).json({ message: 'Either projectId or sessionId is required' });
    }

    // Get reviewer's name
    let reviewerName;
    if (reviewerRole === 'student') {
      const student = await Student.findById(reviewerId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      reviewerName = `${student.firstName} ${student.lastName}`;
    } else if (reviewerRole === 'developer') {
      const developer = await Developer.findById(reviewerId);
      if (!developer) {
        return res.status(404).json({ message: 'Developer not found' });
      }
      reviewerName = `${developer.firstName} ${developer.lastName}`;
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      [reviewType === 'project' ? 'projectId' : 'sessionId']: targetId,
      reviewerId,
      reviewerRole
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this ' + reviewType });
    }

    // Create review
    const review = new Review({
      [reviewType === 'project' ? 'projectId' : 'sessionId']: targetId,
      reviewerId,
      reviewerRole,
      reviewerName,
      rating,
      description,
      reviewType
    });

    await review.save();

    // Notification logic
    if (reviewType === 'project' && project) {
      let notificationUserId = null;
      let notificationMessage = '';
      let notificationType = 'new_review';
      let recipientModel = '';
      let senderModel = reviewerRole.charAt(0).toUpperCase() + reviewerRole.slice(1);

      if (reviewerRole === 'organization' || reviewerRole === 'student') {
        notificationUserId = project.developerId;
        recipientModel = 'Developer';
        notificationMessage = `You received a new review for project: ${project.title}`;
      } else if (reviewerRole === 'developer') {
        notificationUserId = project.companyId || project.userId;
        recipientModel = project.companyId ? 'Organization' : 'Student';
        notificationMessage = `A developer reviewed project: ${project.title}`;
      }

      if (notificationUserId) {
        await Notification.create({
          recipient: notificationUserId,
          recipientModel: recipientModel,
          sender: reviewerId,
          senderModel: senderModel,
          projectId: project._id,
          type: notificationType,
          message: notificationMessage
        });
      }
    } else if (reviewType === 'session' && session) {
      let notificationUserId = null;
      let notificationMessage = '';
      let notificationType = 'session_review';
      let recipientModel = '';
      let senderModel = reviewerRole.charAt(0).toUpperCase() + reviewerRole.slice(1);

      if (reviewerRole === 'student') {
        notificationUserId = session.developerId;
        recipientModel = 'Developer';
        notificationMessage = `You received a new review for session: ${session.title}`;
      } else if (reviewerRole === 'developer') {
        notificationUserId = session.studentId;
        recipientModel = 'Student';
        notificationMessage = `You received a new review for session: ${session.title}`;
      }

      if (notificationUserId) {
        await Notification.create({
          recipient: notificationUserId,
          recipientModel: recipientModel,
          sender: reviewerId,
          senderModel: senderModel,
          sessionId: session._id,
          type: notificationType,
          message: notificationMessage
        });
      }
    }

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ 
      message: 'Error creating review', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get reviews for a project or session
const getReviews = async (req, res) => {
  try {
    const { projectId, sessionId } = req.params;
    const reviewType = projectId ? 'project' : 'session';
    const targetId = projectId || sessionId;

    const reviews = await Review.find({
      [reviewType === 'project' ? 'projectId' : 'sessionId']: targetId,
      reviewType
    }).sort({ createdAt: -1 });

    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// Get average rating for a project or session
const getAverageRating = async (req, res) => {
  try {
    const { projectId, sessionId } = req.params;
    const reviewType = projectId ? 'project' : 'session';
    const targetId = projectId || sessionId;

    const averageRating = await Review.getAverageRating(targetId, reviewType);
    res.json({ averageRating });
  } catch (error) {
    console.error('Error fetching average rating:', error);
    res.status(500).json({ message: 'Error fetching average rating' });
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

// Get all reviews for assigned sessions
const getAssignedSessionReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Fetching reviews for sessions assigned to developer:', userId);
    
    // Find all sessions where this developer is assigned
    const sessions = await Session.find({ 
      developerId: userId
    });
    console.log('Found assigned sessions:', sessions.length);

    // Get all session IDs
    const sessionIds = sessions.map(session => session._id);
    console.log('Session IDs:', sessionIds);

    // Find all reviews for these sessions where reviewer is NOT the developer
    const reviews = await Review.find({
      sessionId: { $in: sessionIds },
      reviewerRole: { $ne: 'developer' }  // Only get reviews from students
    }).populate('sessionId', 'title description');
    
    console.log('Found session reviews:', reviews.length);

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
    console.error('Error fetching assigned session reviews:', error);
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
  getAssignedSessionReviews,
  addTestReview,
  getReviews,
  getAverageRating
}; 