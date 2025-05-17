const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Developer = require('../models/Develpor');
const Organization = require('../models/Organization');
const Question = require('../models/question');

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
    const Project = require('../models/Project');
    // Get total counts
    const [totalStudents, totalDevelopers, totalOrganizations, totalQuestions, totalProjects, activeProjects, assignedProjects, completedProjects] = await Promise.all([
      Student.countDocuments(),
      Developer.countDocuments(),
      Organization.countDocuments(),
      Question.countDocuments(),
      Project.countDocuments(),
      Project.countDocuments({ status: 'open' }),
      Project.countDocuments({ status: { $in: ['assigned', 'in-progress'] } }),
      Project.countDocuments({ status: 'completed' })
    ]);

    // Calculate total users
    const totalUsers = totalStudents + totalDevelopers + totalOrganizations;

    // Calculate percentages
    const studentPercentage = Math.round((totalStudents / totalUsers) * 100);
    const developerPercentage = Math.round((totalDevelopers / totalUsers) * 100);
    const organizationPercentage = Math.round((totalOrganizations / totalUsers) * 100);

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

    // Find today's questions, answers, students, developers, organizations, projects
    const [questions, answers, students, developers, organizations, projects] = await Promise.all([
      require('../models/question').find({ createdAt: { $gte: start, $lte: end } }),
      require('../models/answer').find({ createdAt: { $gte: start, $lte: end } }),
      Student.find({ createdAt: { $gte: start, $lte: end } }),
      Developer.find({ createdAt: { $gte: start, $lte: end } }),
      Organization.find({ createdAt: { $gte: start, $lte: end } }),
      require('../models/Project').find({ createdAt: { $gte: start, $lte: end } })
    ]);

    // Format activities
    const activities = [];
    questions.forEach(q => activities.push({ type: 'question', text: `New question posted: ${q.title || 'Untitled'}` }));
    answers.forEach(a => activities.push({ type: 'answer', text: `New answer posted` }));
    students.forEach(s => activities.push({ type: 'student', text: `New student registered: ${s.firstName} ${s.lastName}` }));
    developers.forEach(d => activities.push({ type: 'developer', text: `New developer registered: ${d.firstName} ${d.lastName}` }));
    organizations.forEach(o => activities.push({ type: 'organization', text: `New organization registered: ${o.companyName}` }));
    projects.forEach(p => activities.push({ type: 'project', text: `New project posted: ${p.title || 'Untitled'}` }));

    // Sort by most recent (if needed)
    activities.reverse();

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
