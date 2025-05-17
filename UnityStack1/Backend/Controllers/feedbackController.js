const Feedback = require('../models/Feedback');
const Student = require('../models/Student');
const Developer = require('../models/Develpor');
const Organization = require('../models/Organization');

exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, role, rating, description } = req.body;

    // Validate email exists in the selected role's database
    let userExists = false;
    switch (role) {
      case 'student':
        userExists = await Student.findOne({ email });
        break;
      case 'developer':
        userExists = await Developer.findOne({ email });
        break;
      case 'organization':
        userExists = await Organization.findOne({ email });
        break;
    }

    if (!userExists) {
      return res.status(400).json({ 
        message: `Email not found in ${role} database. Please use your registered email.` 
      });
    }

    // Create new feedback
    const feedback = new Feedback({
      name,
      email,
      role,
      rating,
      description,
      seen: false
    });

    await feedback.save();

    res.status(201).json({ 
      message: 'Feedback submitted successfully',
      feedback 
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ 
      message: 'Error submitting feedback',
      error: error.message 
    });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ 
      message: 'Error fetching feedbacks',
      error: error.message 
    });
  }
};

exports.getUnseenFeedbackCount = async (req, res) => {
  try {
    const count = await Feedback.countDocuments({ seen: false });
    res.json({ count });
  } catch (error) {
    console.error('Error getting unseen feedback count:', error);
    res.status(500).json({ 
      message: 'Error getting unseen feedback count',
      error: error.message 
    });
  }
};

exports.markFeedbackAsSeen = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    await Feedback.findByIdAndUpdate(feedbackId, { seen: true });
    res.json({ message: 'Feedback marked as seen' });
  } catch (error) {
    console.error('Error marking feedback as seen:', error);
    res.status(500).json({ 
      message: 'Error marking feedback as seen',
      error: error.message 
    });
  }
};

exports.getRecentFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(feedbacks);
  } catch (error) {
    console.error('Error getting recent feedbacks:', error);
    res.status(500).json({ 
      message: 'Error getting recent feedbacks',
      error: error.message 
    });
  }
};

exports.markAllAsSeen = async (req, res) => {
  try {
    await Feedback.updateMany(
      { seen: false },
      { $set: { seen: true } }
    );
    res.json({ message: 'All feedback marked as seen' });
  } catch (error) {
    console.error('Error marking all feedback as seen:', error);
    res.status(500).json({ 
      message: 'Error marking all feedback as seen',
      error: error.message 
    });
  }
}; 