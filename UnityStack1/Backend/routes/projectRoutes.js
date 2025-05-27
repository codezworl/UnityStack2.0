const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const Project = require("../models/Project");
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
  getInvoiceProjects,
  getAssignedByMe,
  getFindWorkInvoices,
  downloadInvoice
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
router.get("/assigned-by-me", authenticateToken, getAssignedByMe);
router.get("/history", authenticateToken, getProjectHistory);
router.get("/active", authenticateToken, getActiveProjects);
router.get("/invoices", authenticateToken, getInvoiceProjects);
router.get("/find-work-invoices", authenticateToken, getFindWorkInvoices);
router.get("/:id/invoice", authenticateToken, downloadInvoice);

// Project status and action routes
router.patch("/:id/close", authenticateToken, closeProject);
router.post("/:id/assign", authenticateToken, assignProject);
router.patch("/:id/payment", authenticateToken, updatePaymentStatus);
router.patch("/:id/progress", authenticateToken, updateProgress);
router.post("/:id/withdraw", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { amountUS, amountPKR, bankName, accountNumber, accountHolderName, swiftCode, routingNumber } = req.body;
    const userId = req.user._id;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Verify project is completed and paid
    if (project.status !== 'completed' || project.paymentStatus !== 'paid') {
      return res.status(400).json({ message: "Project must be completed and paid before withdrawal" });
    }

    // Update project with withdrawal details and set payment status to released
    project.paymentDetails = {
      withdrawalStatus: 'withdrawn',
      withdrawalDate: new Date(),
      bankDetails: {
        bankName,
        accountNumber,
        accountHolderName,
        swiftCode,
        routingNumber
      },
      amountUS,
      amountPKR
    };
    project.paymentStatus = 'released';

    await project.save();

    res.status(200).json({
      success: true,
      message: "Withdrawal request processed successfully",
      project
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    res.status(500).json({ message: "Error processing withdrawal request" });
  }
});

// Bid routes
router.get("/:id/bids", authenticateToken, getProjectBids);
router.post("/:id/bids", authenticateToken, submitBid);

// Parameterized routes should be last
router.get("/:id", authenticateToken, getProjectById);
router.put("/:id", authenticateToken, upload.single("projectFile"), updateProject);
router.delete("/:id", authenticateToken, deleteProject);

module.exports = router;