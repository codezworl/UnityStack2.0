const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const {
  createSubmission,
  getSubmissionByProject,
  updateSubmissionStatus,
  editSubmission,
  upload
} = require('../Controllers/submissionController');
const path = require('path');
const fs = require('fs');

// Create a new submission
router.post(
  '/',
  authenticateToken,
  upload.fields([
    { name: 'zipFile', maxCount: 1 },
    { name: 'docFile', maxCount: 1 }
  ]),
  createSubmission
);

// Get submission by project ID
router.get('/:projectId', authenticateToken, getSubmissionByProject);

// Update submission status (approve/reject)
router.patch('/:projectId/status', authenticateToken, updateSubmissionStatus);

// Edit submission
router.put(
  '/:projectId',
  authenticateToken,
  upload.fields([
    { name: 'zipFile', maxCount: 1 },
    { name: 'docFile', maxCount: 1 }
  ]),
  editSubmission
);

// Download submission file
router.get('/download/:filename', authenticateToken, (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads/submissions', filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  // Send the file
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).json({ message: 'Error downloading file' });
    }
  });
});

module.exports = router; 