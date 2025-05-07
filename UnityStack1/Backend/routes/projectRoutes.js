const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const { 
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
} = require("../Controllers/ProjectController");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/projects";
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

// Project CRUD routes
router.post("/", authenticateToken, upload.single("projectFile"), createProject);
router.get("/", authenticateToken, getAllProjects);
router.get("/available", authenticateToken, getAvailableProjects);
router.get("/assigned", authenticateToken, getAssignedProjects);
router.get("/history", authenticateToken, getProjectHistory);
router.get("/active", authenticateToken, getActiveProjects);
router.get("/invoices", authenticateToken, getInvoiceProjects);
router.get("/:id", authenticateToken, getProjectById);
router.put("/:id", authenticateToken, upload.single("projectFile"), updateProject);
router.delete("/:id", authenticateToken, deleteProject);

// Project status and action routes
router.patch("/:id/close", authenticateToken, closeProject);
router.post("/:id/assign", authenticateToken, assignProject);
router.patch("/:id/payment", authenticateToken, updatePaymentStatus);
router.patch("/:id/progress", authenticateToken, updateProgress);

// Bid routes
router.get("/:id/bids", authenticateToken, getProjectBids);
router.post("/:id/bids", authenticateToken, submitBid);

module.exports = router;
