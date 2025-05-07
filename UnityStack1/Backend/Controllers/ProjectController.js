const Project = require("../models/Project");
const ProjectHistory = require("../models/ProjectHistory");
const Organization = require("../models/Organization");
const Notification = require("../models/notification");
const Developer =require("../models/Develpor");
const Bid = require('../models/Bid');

// Add this helper function at the top of the file after imports
const createNotification = async ({ userId, type, message, projectId }) => {
  try {
    await Notification.create({
      Organization: userId,
      title: type,
      message,
      type: 'info',
      link: projectId ? `/project/${projectId}` : null
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Create a new project
const createProject = async (req, res) => {
  try {
    const { title, description, skills, budget, deadline } = req.body;
    const companyId = req.user.id;

    // Validate required fields
    if (!title || !description || !skills || !budget || !deadline) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Get company details
    const company = await Organization.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Create project object
    const project = new Project({
      title,
      description,
      skills,
      budget,
      deadline,
      companyId,
      companyName: company.companyName,
      status: 'open',
      bids: [],
      file: req.file ? req.file.filename : null
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error creating project" });
  }
};

// Get all projects for a company
const getAllProjects = async (req, res) => {
  try {
    const companyId = req.user.id;
    const projects = await Project.find({ 
      companyId,
      status: { $ne: 'assigned' }, // Exclude assigned projects
      isVisible: true // Only show visible projects
    })
    .populate({
      path: 'bids.bidderId',
      select: 'firstName lastName companyName email profilePicture rating experience skills'
    })
    .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};

// Get project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate({
        path: 'bids.bidderId',
        select: 'firstName lastName companyName email profilePicture rating experience skills'
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Error fetching project" });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const { title, description, skills, budget, deadline } = req.body;
    const projectId = req.params.id;
    const companyId = req.user.id;

    // Find project and verify ownership
    const project = await Project.findOne({ _id: projectId, companyId });
    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }

    // Update project fields
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        title: title || project.title,
        description: description || project.description,
        skills: skills || project.skills,
        budget: budget || project.budget,
        deadline: deadline || project.deadline,
        file: req.file ? req.file.filename : project.file
      },
      { new: true }
    ).populate({
      path: 'bids.bidderId',
      select: 'firstName lastName companyName email profilePicture rating experience skills'
    });

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Error updating project" });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const companyId = req.user.id;

    const project = await Project.findOneAndDelete({ _id: projectId, companyId });
    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Error deleting project" });
  }
};

// Close a project
const closeProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role || 'Organization'; // Default to Organization if role not specified

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (permanent) {
      // Permanently delete the project
      await Project.findByIdAndDelete(id);
      
      // Create history entry for deletion
      await ProjectHistory.create({
        projectId: id,
        projectTitle: project.title,
        action: "deleted",
        details: "Project was permanently deleted",
        performedBy: userId,
        performedByRole: userRole
      });

      return res.json({ message: "Project deleted successfully" });
    } else {
      // Just close the project
      project.status = "closed";
      project.closedAt = new Date();
      await project.save();

      // Create history entry for closure
      await ProjectHistory.create({
        projectId: id,
        projectTitle: project.title,
        action: "closed",
        details: "Project was closed",
        performedBy: userId,
        performedByRole: userRole
      });

      return res.json({ message: "Project closed successfully" });
    }
  } catch (error) {
    console.error("Error in closeProject:", error);
    return res.status(500).json({ message: "Error closing project", error: error.message });
  }
};

// Assign project to developer
const assignProject = async (req, res) => {
  try {
    const { developerId, paymentInfo } = req.body;
    const projectId = req.params.id;
    const companyId = req.user.id;

    // Find project and verify ownership
    const project = await Project.findOne({ _id: projectId, companyId })
      .populate({
        path: 'bids',
        select: 'amount proposal bidderId status userName userRole'
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }

    // Verify the bid exists and get the bidderId
    const selectedBid = project.bids.find(bid => bid.bidderId && bid.bidderId.toString() === developerId);
    if (!selectedBid) {
      return res.status(400).json({ message: "No bid found from this bidder" });
    }

    // Update project status and assigned bidder
    project.status = 'assigned';
    project.assignedDeveloper = developerId;
    project.assignedDeveloperName = selectedBid.userName; // Store the bidder's username
    project.assignedDeveloperRole = selectedBid.userRole; // Store the bidder's role
    project.assignedDate = new Date();
    project.isVisible = false; // Hide from marketplace
    project.paymentStatus = 'paid'; // Set as paid since payment is made
    project.paymentDate = new Date();

    // Update bid status
    project.bids = project.bids.map(bid => ({
      ...bid.toObject(),
      status: bid.bidderId && bid.bidderId.toString() === developerId ? 'accepted' : 'rejected'
    }));

    await project.save();

    // Create notifications for both parties
    await createNotification({
      userId: developerId,
      type: 'PROJECT_ASSIGNED',
      message: `You have been assigned to project: ${project.title}`,
      projectId: project._id
    });

    await createNotification({
      userId: companyId,
      type: 'PROJECT_PAYMENT_CONFIRMED',
      message: `Payment confirmed for project: ${project.title}`,
      projectId: project._id
    });

    // Fetch the updated project with populated fields
    const updatedProject = await Project.findById(project._id)
      .populate({
        path: 'bids',
        select: 'amount proposal bidderId status userName userRole'
      });

    res.status(200).json({
      message: "Project assigned successfully",
      project: updatedProject
    });
  } catch (error) {
    console.error("Error assigning project:", error);
    res.status(500).json({ message: "Error assigning project", error: error.message });
  }
};

// Get project history
const getProjectHistory = async (req, res) => {
  try {
    const companyId = req.user.id;
    const projects = await Project.find({
      companyId,
      status: { $in: ['completed', 'cancelled'] }
    }).populate('assignedDeveloper', 'name email profilePicture');

    const stats = {
      total: await Project.countDocuments({ companyId }),
      completed: await Project.countDocuments({ companyId, status: 'completed' }),
      cancelled: await Project.countDocuments({ companyId, status: 'cancelled' }),
      totalEarnings: await Project.aggregate([
        { $match: { companyId: companyId.toString(), status: 'completed' } },
        { $group: { _id: null, total: { $sum: "$budget" } } }
      ])
    };

    res.status(200).json({
      projects,
      stats: {
        ...stats,
        totalEarnings: stats.totalEarnings[0]?.total || 0
      }
    });
  } catch (error) {
    console.error("Error fetching project history:", error);
    res.status(500).json({ message: "Error fetching project history" });
  }
};

// Inside the 'submitBid' function in your controller

const submitBid = async (req, res) => {
  const { amount, proposal, bidderName, userRole, userName } = req.body;
  const userId = req.user.id;
  const { id } = req.params;

  // Log the data
  console.log("Bid data received:", { amount, proposal, bidderName, userRole, userName, userId, projectId: id });

  // If userName is not provided, set it to bidderName
  const finalUserName = userName || bidderName;

  // Validate required fields
  if (!amount || !proposal || !userRole || !finalUserName || !bidderName || !userId || !id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new Bid document
    const newBid = new Bid({
      amount,
      proposal,
      bidderName: finalUserName,  // Use finalUserName which is either userName or bidderName
      userRole,
      userName: finalUserName,    // Ensure userName is set
      bidderId: userId,
      projectId: id,
    });

    await newBid.save();

    const project = await Project.findById(id);
    if (project) {
      project.bids.push(newBid._id);
      await project.save();
    }

    res.status(201).json({ message: "Bid submitted successfully", bid: newBid });
  } catch (error) {
    console.error("Error submitting bid:", error);
    res.status(500).json({ message: "Error submitting bid", error: error.message });
  }
};

// Get project bids
const getProjectBids = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Fetch the project and populate the bids array
    const project = await Project.findById(projectId)
      .populate({
        path: 'bids',
        select: 'amount proposal userName userRole bidderId createdAt'  // Added bidderId to selected fields
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Enrich the bids with all necessary information
    const enrichedBids = project.bids.map(bid => ({
      _id: bid._id,
      userName: bid.userName,
      userRole: bid.userRole,
      amount: bid.amount,
      proposal: bid.proposal,
      bidderId: bid.bidderId,  // Include bidderId in the response
      createdAt: bid.createdAt
    }));

    res.status(200).json({
      projectId: project._id,
      bids: enrichedBids,
    });

  } catch (error) {
    console.error("Error fetching project bids:", error);
    res.status(500).json({ message: "Error fetching project bids" });
  }
};

// Get active projects
const getActiveProjects = async (req, res) => {
  try {
    const companyId = req.user.id;
    const projects = await Project.find({
      companyId,
      status: { $in: ['assigned', 'in-progress'] },
      paymentStatus: { $in: ['paid', 'released'] }
    })
    .select('title description status progress assignedDeveloperName assignedDeveloperRole assignedDate deadline budget')
    .sort({ assignedDate: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching active projects:", error);
    res.status(500).json({ message: "Error fetching active projects" });
  }
};

// Update project payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    const companyId = req.user.id;

    const project = await Project.findOne({ _id: id, companyId });
    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }

    project.paymentStatus = paymentStatus;
    project.paymentDate = new Date();
    
    if (paymentStatus === 'paid' && !project.startDate) {
      project.startDate = new Date();
      project.status = 'in-progress';
    }

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Error updating payment status" });
  }
};

// Update project progress
const updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    const companyId = req.user.id;

    const project = await Project.findOne({ _id: id, companyId });
    if (!project) {
      return res.status(404).json({ message: "Project not found or unauthorized" });
    }

    project.progress = progress;
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Error updating progress" });
  }
};

// Get all available projects for bidding
const getAvailableProjects = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    
    // Find all projects that are open and not created by the current user
    const projects = await Project.find({ 
      companyId: { $ne: currentUserId }, // Exclude projects created by current user
      status: 'open' // Only show open projects
    }).populate({
      path: 'bids.bidderId',
      select: 'name email profilePicture rating experience skills'
    }).sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching available projects:", error);
    res.status(500).json({ message: "Error fetching available projects" });
  }
};

// Get assigned projects
const getAssignedProjects = async (req, res) => {
  try {
    const developerId = req.user.id;
    const projects = await Project.find({
      assignedDeveloper: developerId,
      status: { $in: ['assigned', 'in-progress'] }
    }).populate('companyId', 'companyName')
      .sort({ assignedDate: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching assigned projects:", error);
    res.status(500).json({ message: "Error fetching assigned projects" });
  }
};

// Get invoice projects
const getInvoiceProjects = async (req, res) => {
  try {
    const companyId = req.user.id;
    const projects = await Project.find({
      companyId,
      status: 'assigned',
      paymentStatus: { $in: ['pending', 'paid'] }
    })
    .populate('assignedDeveloper', 'userName email')
    .sort({ assignedDate: -1 });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching invoice projects:", error);
    res.status(500).json({ message: "Error fetching invoice projects" });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  closeProject,
  assignProject,
  getProjectHistory,
  submitBid,
  getProjectBids,
  getActiveProjects,
  updatePaymentStatus,
  updateProgress,
  getAvailableProjects,
  getAssignedProjects,
  getInvoiceProjects
};
