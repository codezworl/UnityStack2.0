const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Developer = require('../models/Develpor');
const Organization = require('../models/Organization');
const Question = require('../models/question');
const Project = require('../models/Project');
const Session = require('../models/session');

// Login handler
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.json({ token, admin: { name: admin.name, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [students, developers, organizations] = await Promise.all([
      Student.find().select('-password -verificationCode'),
      Developer.find().select('-password -verificationCode'),
      Organization.find().select('-password -verificationCode')
    ]);

    // Format the data to include role
    const formattedStudents = students.map(s => ({
      ...s.toObject(),
      role: 'student'
    }));
    const formattedDevelopers = developers.map(d => ({
      ...d.toObject(),
      role: 'developer'
    }));
    const formattedOrganizations = organizations.map(o => ({
      ...o.toObject(),
      role: 'organization'
    }));

    // Combine all users
    const allUsers = [...formattedStudents, ...formattedDevelopers, ...formattedOrganizations];

    res.json(allUsers);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { userId, role } = req.params;

    let deletedUser;
    switch (role) {
      case 'student':
        deletedUser = await Student.findByIdAndDelete(userId);
        break;
      case 'developer':
        deletedUser = await Developer.findByIdAndDelete(userId);
        break;
      case 'organization':
        deletedUser = await Organization.findByIdAndDelete(userId);
        break;
      default:
        return res.status(400).json({ message: 'Invalid user role' });
    }

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Seed admin users if not present
exports.seedAdmins = async () => {
  const admins = [
    { name: 'alyan shahid', email: 'admin1@gmail.com', password: 'alyan123456' },
    { name: 'waqas zafar', email: 'admin2@gmail.com', password: 'waqas123456' }
  ];

  for (const admin of admins) {
    const exists = await Admin.findOne({ email: admin.email });
    if (!exists) {
      const hashed = await bcrypt.hash(admin.password, 10);
      await Admin.create({ ...admin, password: hashed });
      console.log(`Admin ${admin.email} created`);
    } else {
      console.log(`Admin ${admin.email} already exists`);
    }
  }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts from database
    const [
      totalStudents,
      totalDevelopers,
      totalOrganizations,
      totalQuestions,
      totalProjects,
      activeProjects,
      assignedProjects,
      completedProjects,
      totalSessions,
      activeSessions,
      completedSessions
    ] = await Promise.all([
      Student.countDocuments(),
      Developer.countDocuments(),
      Organization.countDocuments(),
      require('../models/question').countDocuments(),
      require('../models/Project').countDocuments(),
      require('../models/Project').countDocuments({ status: 'active' }),
      require('../models/Project').countDocuments({ status: 'assigned' }),
      require('../models/Project').countDocuments({ status: 'completed' }),
      require('../models/session').countDocuments(),
      require('../models/session').countDocuments({ status: 'active' }),
      require('../models/session').countDocuments({ status: 'completed' })
    ]);

    // Calculate percentages
    const totalUsers = totalStudents + totalDevelopers + totalOrganizations;
    const studentPercentage = totalUsers > 0 ? (totalStudents / totalUsers) * 100 : 0;
    const developerPercentage = totalUsers > 0 ? (totalDevelopers / totalUsers) * 100 : 0;
    const organizationPercentage = totalUsers > 0 ? (totalOrganizations / totalUsers) * 100 : 0;

    res.json({
      stats: {
        totalStudents,
        totalDevelopers,
        totalOrganizations,
        totalQuestions,
        totalProjects,
        activeProjects,
        assignedProjects,
        completedProjects,
        totalSessions,
        activeSessions,
        completedSessions,
        revenue: 0 // Set revenue to zero for now
      },
      percentages: {
        students: studentPercentage,
        developers: developerPercentage,
        organizations: organizationPercentage
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get today's activities
exports.getTodayActivities = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Find today's activities
    const [
      questions,
      answers,
      students,
      developers,
      organizations,
      projects,
      submissions,
      sessions,
      withdrawals
    ] = await Promise.all([
      Question.find({ createdAt: { $gte: start, $lte: end } }),
      require('../models/answer').find({ createdAt: { $gte: start, $lte: end } }),
      Student.find({ createdAt: { $gte: start, $lte: end } }),
      Developer.find({ createdAt: { $gte: start, $lte: end } }),
      Organization.find({ createdAt: { $gte: start, $lte: end } }),
      Project.find({ createdAt: { $gte: start, $lte: end } }),
      require('../models/projectsubmission').find({ createdAt: { $gte: start, $lte: end } }).populate('projectId', 'title'),
      Session.find({ 
        $or: [
          { createdAt: { $gte: start, $lte: end } },
          { status: { $in: ['completed', 'cancelled'] }, updatedAt: { $gte: start, $lte: end } }
        ]
      }),
      Session.find({ 
        'withdrawalInfo.withdrawalDate': { $gte: start, $lte: end }
      })
    ]);

    // Format activities
    const activities = [];

    // Questions and Answers
    questions.forEach(q => activities.push({
      type: 'question',
      text: `New question posted: ${q.title || 'Untitled'}`,
      timestamp: q.createdAt
    }));
    answers.forEach(a => activities.push({
      type: 'answer',
      text: `New answer posted for question`,
      timestamp: a.createdAt
    }));

    // User Registrations
    students.forEach(s => activities.push({
      type: 'student',
      text: `New student registered: ${s.firstName} ${s.lastName}`,
      timestamp: s.createdAt
    }));
    developers.forEach(d => activities.push({
      type: 'developer',
      text: `New developer registered: ${d.firstName} ${d.lastName}`,
      timestamp: d.createdAt
    }));
    organizations.forEach(o => activities.push({
      type: 'organization',
      text: `New organization registered: ${o.companyName}`,
      timestamp: o.createdAt
    }));

    // Projects
    projects.forEach(p => activities.push({
      type: 'project',
      text: `New project posted: ${p.title || 'Untitled'}`,
      timestamp: p.createdAt
    }));

    // Submissions
    submissions.forEach(s => activities.push({
      type: 'submission',
      text: `New project submission: ${s.projectId?.title || 'Untitled'}`,
      timestamp: s.createdAt
    }));

    // Sessions
    sessions.forEach(s => {
      if (s.createdAt >= start && s.createdAt <= end) {
        activities.push({
          type: 'session',
          text: `New session booked: ${s.title || 'Untitled'}`,
          timestamp: s.createdAt
        });
      }
      if (s.status === 'completed' && s.updatedAt >= start && s.updatedAt <= end) {
        activities.push({
          type: 'session',
          text: `Session completed: ${s.title || 'Untitled'}`,
          timestamp: s.updatedAt
        });
      }
    });

    // Withdrawals
    withdrawals.forEach(w => activities.push({
      type: 'withdrawal',
      text: `Payment withdrawal processed for session: ${w.title || 'Untitled'}`,
      timestamp: w.withdrawalInfo.withdrawalDate
    }));

    // Sort by most recent
    activities.sort((a, b) => b.timestamp - a.timestamp);

    res.json({ activities });
  } catch (error) {
    console.error('Error getting today activities:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { userId, role } = req.params;
    const updateData = req.body;

    let updatedUser;
    switch (role) {
      case 'student':
        updatedUser = await Student.findByIdAndUpdate(
          userId,
          { 
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            email: updateData.email,
            university: updateData.university,
            semester: updateData.semester
          },
          { new: true }
        ).select('-password -verificationCode');
        break;
      case 'developer':
        updatedUser = await Developer.findByIdAndUpdate(
          userId,
          { 
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            email: updateData.email,
            experience: updateData.experience,
            domainTags: updateData.domainTags
          },
          { new: true }
        ).select('-password -verificationCode');
        break;
      case 'organization':
        updatedUser = await Organization.findByIdAndUpdate(
          userId,
          { 
            companyName: updateData.companyName,
            companyEmail: updateData.companyEmail,
            website: updateData.website,
            selectedServices: updateData.selectedServices
          },
          { new: true }
        ).select('-password -verificationCode');
        break;
      default:
        return res.status(400).json({ message: 'Invalid user role' });
    }

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add role to the response
    const response = {
      ...updatedUser.toObject(),
      role
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get revenue data
exports.getRevenueData = async (req, res) => {
  try {
    // Find all completed projects with released payments
    const projects = await Project.find({
      status: 'completed',
      paymentStatus: 'released'
    }).select('acceptedBidAmount');

    // Find all completed sessions with released payments
    const sessions = await Session.find({
      status: 'completed',
      paymentStatus: 'released'
    }).select('amount');

    // Calculate total platform fee from projects (10% of bid amounts)
    const projectRevenue = projects.reduce((sum, project) => {
      const bidAmount = project.acceptedBidAmount || 0;
      return sum + (bidAmount * 0.1); // 10% platform fee
    }, 0);

    // Calculate total platform fee from sessions (10% of session amounts)
    const sessionRevenue = sessions.reduce((sum, session) => {
      const sessionAmount = session.amount || 0;
      return sum + (sessionAmount * 0.1); // 10% platform fee
    }, 0);

    // Total revenue combining both projects and sessions
    const totalRevenue = projectRevenue + sessionRevenue;

    // Calculate developer share (90% of total)
    const developerShare = (projectRevenue / 0.1 - projectRevenue) + (sessionRevenue / 0.1 - sessionRevenue);

    res.json({
      projects,
      sessions,
      totalRevenue, // This is now the total platform fee
      developerShare,
      projectRevenue,
      sessionRevenue
    });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    // Find all projects with payment status
    const projects = await Project.find({
      paymentStatus: { $in: ['paid', 'on_hold', 'released'] }
    }).populate('companyId', 'companyName')
      .populate('developerId', 'firstName lastName');

    // Find all sessions with payment status
    const sessions = await Session.find({
      paymentStatus: { $in: ['completed', 'released'] }
    }).populate('studentId', 'firstName lastName')
      .populate('developerId', 'firstName lastName');

    // Format project transactions
    const projectTransactions = projects.map(project => ({
      _id: project._id,
      type: 'Project',
      amount: project.acceptedBidAmount || project.budget,
      status: project.status,
      paymentStatus: project.paymentStatus,
      date: project.updatedAt,
      user: project.companyId ? project.companyId.companyName : 
            (project.userName || 'Unknown'),
      developer: project.developerId ? `${project.developerId.firstName} ${project.developerId.lastName}` : 'Unknown'
    }));

    // Format session transactions
    const sessionTransactions = sessions.map(session => ({
      _id: session._id,
      type: 'Session',
      amount: session.amount,
      status: session.status,
      paymentStatus: session.paymentStatus,
      date: session.date,
      user: session.studentId ? `${session.studentId.firstName} ${session.studentId.lastName}` : 'Unknown',
      developer: session.developerId ? `${session.developerId.firstName} ${session.developerId.lastName}` : 'Unknown'
    }));

    // Combine and sort all transactions by date
    const allTransactions = [...projectTransactions, ...sessionTransactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ transactions: allTransactions });
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Release payment
exports.releasePayment = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    // Try to find in sessions first
    let session = await Session.findById(transactionId);
    if (session) {
      session.paymentStatus = 'released';
      await session.save();
      return res.json({ message: 'Session payment released successfully' });
    }

    // If not found in sessions, try projects
    let project = await Project.findById(transactionId);
    if (project) {
      project.paymentStatus = 'released';
      await project.save();
      return res.json({ message: 'Project payment released successfully' });
    }

    return res.status(404).json({ message: 'Transaction not found' });
  } catch (error) {
    console.error('Error releasing payment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel payment
exports.cancelPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    // Try to find in sessions first
    let session = await Session.findById(transactionId);
    if (session) {
      session.paymentStatus = 'failed';
      await session.save();
      return res.json({ message: 'Session payment cancelled successfully' });
    }

    // If not found in sessions, try projects
    let project = await Project.findById(transactionId);
    if (project) {
      project.paymentStatus = 'failed';
      await project.save();
      return res.json({ message: 'Project payment cancelled successfully' });
    }

    return res.status(404).json({ message: 'Transaction not found' });
  } catch (error) {
    console.error('Error cancelling payment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  login: exports.login,
  getAllUsers: exports.getAllUsers,
  deleteUser: exports.deleteUser,
  seedAdmins: exports.seedAdmins,
  getDashboardStats: exports.getDashboardStats,
  getTodayActivities: exports.getTodayActivities,
  updateUser: exports.updateUser,
  getRevenueData: exports.getRevenueData,
  getTransactions: exports.getTransactions,
  releasePayment: exports.releasePayment,
  cancelPayment: exports.cancelPayment
};
