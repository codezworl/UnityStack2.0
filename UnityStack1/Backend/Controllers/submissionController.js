const ProjectSubmission = require('../models/projectsubmission');
const Project = require('../models/Project');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/submissions';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Create a new submission
const createSubmission = async (req, res) => {
  try {
    const { projectId, title, description } = req.body;
    const userId = req.user._id;
    const userRole = req.userRole;

    console.log('Creating submission with data:', {
      projectId,
      title,
      description,
      userId,
      userRole,
      files: req.files ? Object.keys(req.files) : 'No files'
    });

    // Check if project exists and is assigned to the developer
    const project = await Project.findById(projectId);
    console.log('Found project:', project ? {
      id: project._id,
      title: project.title,
      status: project.status,
      assignedDeveloper: project.assignedDeveloper,
      developerId: project.developerId
    } : 'Project not found');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.assignedDeveloper.toString() !== userId.toString()) {
      console.log('Authorization failed:', {
        projectDeveloper: project.assignedDeveloper.toString(),
        currentUser: userId.toString()
      });
      return res.status(403).json({ message: 'Not authorized to submit for this project' });
    }

    // Check if project is in progress
    if (project.status !== 'in-progress') {
      console.log('Project status check failed:', {
        currentStatus: project.status,
        requiredStatus: 'in-progress'
      });
      return res.status(400).json({ message: 'Project is not in progress' });
    }

    // Check if files were uploaded
    if (!req.files || !req.files.zipFile || !req.files.docFile) {
      console.log('Missing files:', {
        hasZipFile: !!req.files?.zipFile,
        hasDocFile: !!req.files?.docFile
      });
      return res.status(400).json({ message: 'Both ZIP and DOC files are required' });
    }

    const submission = new ProjectSubmission({
      projectId,
      submitterId: userId,
      submitterName: `${req.user.firstName} ${req.user.lastName}`,
      submitterRole: userRole,
      title,
      description,
      files: [
        {
          filename: req.files.zipFile[0].filename,
          originalname: req.files.zipFile[0].originalname,
          path: req.files.zipFile[0].path,
          mimetype: req.files.zipFile[0].mimetype
        },
        {
          filename: req.files.docFile[0].filename,
          originalname: req.files.docFile[0].originalname,
          path: req.files.docFile[0].path,
          mimetype: req.files.docFile[0].mimetype
        }
      ],
      status: 'pending'
    });

    await submission.save();
    console.log('Submission saved successfully:', {
      submissionId: submission._id,
      projectId: submission.projectId
    });

    // Update project status
    project.status = 'submitted';
    await project.save();
    console.log('Project status updated to submitted');

    res.status(201).json({
      message: 'Submission created successfully',
      submission
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ message: 'Error creating submission', error: error.message });
  }
};

// Get submission by project ID
const getSubmissionByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id;
    const userRole = req.userRole;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check authorization
    const isAuthorized = 
      project.assignedDeveloper.toString() === userId.toString() ||
      project.userId.toString() === userId.toString() ||
      project.companyId.toString() === userId.toString();

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Not authorized to view this submission' });
    }

    const submission = await ProjectSubmission.findOne({ projectId });
    if (!submission) {
      return res.status(404).json({ message: 'No submission found for this project' });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ message: 'Error fetching submission', error: error.message });
  }
};

// Update submission status
const updateSubmissionStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, feedback, issues } = req.body;
    const userId = req.user._id;
    const userRole = req.userRole;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only project owner can update submission status
    const isOwner = 
      project.userId.toString() === userId.toString() ||
      project.companyId.toString() === userId.toString();

    if (!isOwner) {
      return res.status(403).json({ message: 'Not authorized to update submission status' });
    }

    const submission = await ProjectSubmission.findOne({ projectId });
    if (!submission) {
      return res.status(404).json({ message: 'No submission found for this project' });
    }

    submission.status = status;
    submission.feedback = feedback;
    
    if (status === 'rejected') {
      submission.rejectionDetails = {
        issues,
        message: feedback,
        rejectedBy: userId,
        rejectedByRole: userRole,
        rejectedAt: new Date()
      };
    }

    await submission.save();

    res.status(200).json({
      message: 'Submission status updated successfully',
      submission
    });
  } catch (error) {
    console.error('Error updating submission status:', error);
    res.status(500).json({ message: 'Error updating submission status', error: error.message });
  }
};

// Edit submission
const editSubmission = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description } = req.body;
    const userId = req.user._id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only assigned developer can edit submission
    if (project.assignedDeveloper.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this submission' });
    }

    const submission = await ProjectSubmission.findOne({ projectId });
    if (!submission) {
      return res.status(404).json({ message: 'No submission found for this project' });
    }

    // Can only edit if status is rejected
    if (submission.status !== 'rejected') {
      return res.status(400).json({ message: 'Can only edit rejected submissions' });
    }

    // Update files if new ones are uploaded
    if (req.files) {
      const files = [];
      if (req.files.zipFile) {
        files.push({
          filename: req.files.zipFile[0].filename,
          originalname: req.files.zipFile[0].originalname,
          path: req.files.zipFile[0].path,
          mimetype: req.files.zipFile[0].mimetype
        });
      }
      if (req.files.docFile) {
        files.push({
          filename: req.files.docFile[0].filename,
          originalname: req.files.docFile[0].originalname,
          path: req.files.docFile[0].path,
          mimetype: req.files.docFile[0].mimetype
        });
      }
      if (files.length > 0) {
        submission.files = files;
      }
    }

    submission.title = title || submission.title;
    submission.description = description || submission.description;
    submission.status = 'pending';
    submission.rejectionDetails = null;

    await submission.save();

    // Update project status back to in-progress
    project.status = 'in-progress';
    await project.save();

    res.status(200).json({
      message: 'Submission updated successfully',
      submission
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({ message: 'Error updating submission', error: error.message });
  }
};

module.exports = {
  createSubmission,
  getSubmissionByProject,
  updateSubmissionStatus,
  editSubmission,
  upload
}; 