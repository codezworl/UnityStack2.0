const Review = require('../models/review');
const Project = require('../models/Project');
const Notification = require('../models/notification');
const Session = require('../models/session');
const Student = require('../models/Student');
const Developer = require('../models/Develpor');
const Organization = require('../models/Organization');

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

// Get ratings and reviews for a specific developer (public endpoint)
const getDeveloperRatings = async (req, res) => {
  try {
    const { developerId } = req.params;
    console.log('Fetching ratings for developer:', developerId);
    
    // Find all projects where this developer is assigned
    const projects = await Project.find({ 
      assignedDeveloper: developerId
    });
    console.log('Found assigned projects:', projects.length);

    // Find all sessions where this developer is assigned
    const sessions = await Session.find({ 
      developerId: developerId
    });
    console.log('Found assigned sessions:', sessions.length);

    // Get all project and session IDs
    const projectIds = projects.map(project => project._id);
    const sessionIds = sessions.map(session => session._id);

    // Find all reviews for these projects and sessions where reviewer is NOT the developer
    const [projectReviews, sessionReviews] = await Promise.all([
      Review.find({
        projectId: { $in: projectIds },
        reviewerRole: { $ne: 'developer' }  // Only get reviews from clients/organizations
      }).populate('projectId', 'title description'),
      Review.find({
        sessionId: { $in: sessionIds },
        reviewerRole: { $ne: 'developer' }  // Only get reviews from students
      }).populate('sessionId', 'title description')
    ]);
    
    // Combine all reviews
    const allReviews = [...projectReviews, ...sessionReviews];
    console.log('Total reviews found:', allReviews.length);

    // Calculate average rating
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

    // Calculate rating distribution
    const ratingDistribution = {
      5: allReviews.filter(r => r.rating === 5).length,
      4: allReviews.filter(r => r.rating === 4).length,
      3: allReviews.filter(r => r.rating === 3).length,
      2: allReviews.filter(r => r.rating === 2).length,
      1: allReviews.filter(r => r.rating === 1).length
    };

    res.status(200).json({
      reviews: allReviews,
      stats: {
        totalReviews: allReviews.length,
        averageRating: averageRating,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching developer ratings:', error);
    res.status(500).json({ message: 'Error fetching ratings', error: error.message });
  }
};

// Get ratings and reviews for a specific organization (public endpoint)
const getOrganizationRatings = async (req, res) => {
  try {
    const { organizationId } = req.params;
    console.log('Fetching ratings for organization:', organizationId);
    
    // First, let's check if this organizationId is valid
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      console.log('Organization not found:', organizationId);
      return res.status(404).json({ 
        message: 'Organization not found',
        stats: {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        }
      });
    }
    
    // Find all projects where this organization is the company (project creator)
    const projectsAsCompany = await Project.find({ 
      companyId: organizationId 
    });
    console.log('Projects where organization is company:', projectsAsCompany.length);
    
    // Find all projects where this organization is the assigned developer
    // But first check if the assignedDeveloper is actually an organization
    const projectsAsAssigned = await Project.find({ 
      assignedDeveloper: organizationId 
    });
    console.log('Projects where organization is assigned developer:', projectsAsAssigned.length);
    
    // Combine all projects
    const allProjects = [...projectsAsCompany, ...projectsAsAssigned];
    console.log('Total projects found:', allProjects.length);
    
    // Log project details for debugging
    allProjects.forEach((project, index) => {
      console.log(`Project ${index + 1}:`, {
        id: project._id,
        title: project.title,
        companyId: project.companyId,
        assignedDeveloper: project.assignedDeveloper,
        status: project.status
      });
    });

    // Get all project IDs
    const projectIds = allProjects.map(project => project._id);
    console.log('Project IDs to search for reviews:', projectIds);

    if (projectIds.length === 0) {
      console.log('No projects found for organization');
      return res.status(200).json({
        reviews: [],
        stats: {
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        }
      });
    }

    // Find all reviews for these projects where reviewer is NOT the organization
    const projectReviews = await Review.find({
      projectId: { $in: projectIds },
      reviewerRole: { $ne: 'organization' }  // Only get reviews from developers/students
    }).populate('projectId', 'title description');
    
    console.log('Total reviews found for organization:', projectReviews.length);
    
    // Log review details for debugging
    projectReviews.forEach((review, index) => {
      console.log(`Review ${index + 1}:`, {
        projectId: review.projectId,
        reviewerRole: review.reviewerRole,
        rating: review.rating,
        description: review.description
      });
    });

    // Calculate average rating
    const totalRating = projectReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = projectReviews.length > 0 ? totalRating / projectReviews.length : 0;

    // Calculate rating distribution
    const ratingDistribution = {
      5: projectReviews.filter(r => r.rating === 5).length,
      4: projectReviews.filter(r => r.rating === 4).length,
      3: projectReviews.filter(r => r.rating === 3).length,
      2: projectReviews.filter(r => r.rating === 2).length,
      1: projectReviews.filter(r => r.rating === 1).length
    };

    console.log('Final stats:', {
      totalReviews: projectReviews.length,
      averageRating: averageRating,
      ratingDistribution
    });

    res.status(200).json({
      reviews: projectReviews,
      stats: {
        totalReviews: projectReviews.length,
        averageRating: averageRating,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching organization ratings:', error);
    res.status(500).json({ message: 'Error fetching ratings', error: error.message });
  }
};

// Add a test review for organization debugging
const addTestOrganizationReview = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const userId = req.user._id;

    // Find a project for this organization
    const project = await Project.findOne({ companyId: organizationId });
    if (!project) {
      return res.status(404).json({ message: 'No projects found for this organization' });
    }

    // Create a test review
    const review = new Review({
      projectId: project._id,
      reviewerId: userId,
      reviewerRole: 'developer',
      reviewerName: 'Test Developer',
      rating: 5,
      description: 'This is a test review to verify the organization rating system is working correctly.',
      reviewType: 'project'
    });

    await review.save();
    console.log('Test organization review created:', review);

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating test organization review:', error);
    res.status(500).json({ message: 'Error creating test review', error: error.message });
  }
};

// Debug function to check database state
const debugDatabaseState = async (req, res) => {
  try {
    const { organizationId } = req.params;
    
    // Check total projects
    const totalProjects = await Project.countDocuments();
    
    // Check projects for this organization
    const orgProjects = await Project.find({ 
      $or: [
        { companyId: organizationId },
        { assignedDeveloper: organizationId }
      ]
    });
    
    // Check total reviews
    const totalReviews = await Review.countDocuments();
    
    // Check reviews for this organization's projects
    const projectIds = orgProjects.map(p => p._id);
    const orgReviews = await Review.find({
      projectId: { $in: projectIds }
    });
    
    res.status(200).json({
      debug: {
        totalProjects,
        organizationProjects: orgProjects.length,
        totalReviews,
        organizationReviews: orgReviews.length,
        organizationProjects: orgProjects.map(p => ({
          id: p._id,
          title: p.title,
          companyId: p.companyId,
          assignedDeveloper: p.assignedDeveloper
        })),
        organizationReviews: orgReviews.map(r => ({
          projectId: r.projectId,
          reviewerRole: r.reviewerRole,
          rating: r.rating
        }))
      }
    });
  } catch (error) {
    console.error('Error in debug function:', error);
    res.status(500).json({ message: 'Error in debug function', error: error.message });
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
  getAverageRating,
  getDeveloperRatings,
  getOrganizationRatings,
  addTestOrganizationReview,
  debugDatabaseState
}; 