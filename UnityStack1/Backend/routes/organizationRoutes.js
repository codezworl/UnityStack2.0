const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  signupOrganization,
  loginOrganization,
  verifyOrganizationEmail,
  getOrganizationProfile,
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  updateOrganizationProfile,
  updateOrganizationPassword,
  addSocialMediaLink,
  addService,
  removeService,
  getAllOrganizations,
} = require("../Controllers/organizationController");

const authenticateToken = require("../middleware/auth");
const Organization = require("../models/Organization");
const post = require("../models/post");

const router = express.Router();

// ✅ Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Route for organization signup
router.post(
  "/signup",
  (req, res, next) => {
    console.log("Organization signup request received", req.body); // Debugging log
    next();
  },
  signupOrganization
);

// ✅ Route for organization login
router.post(
  "/login",
  (req, res, next) => {
    console.log("Organization login request received", req.body); // Debugging log
    next();
  },
  loginOrganization
);

// ✅ Route for email verification
router.post(
  "/verify-email",
  (req, res, next) => {
    console.log("Organization email verification request received", req.body); // Debugging log
    next();
  },
  verifyOrganizationEmail
);

// ✅ Route to fetch the full organization profile
router.get("/profile", authenticateToken, getOrganizationProfile);

// ✅ New Route: Fetch only the company name
router.get("/company-name", authenticateToken, async (req, res) => {
  try {
    if (req.userRole !== "organization") {
      return res.status(403).json({ message: "Forbidden: Only organizations can access this" });
    }

    // Fetch only the company name
    const organization = await Organization.findById(req.user._id).select("companyName");

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({ companyName: organization.companyName });
  } catch (error) {
    console.error("❌ Error fetching company name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Blog Post Routes (Image Uploads Fixed)
router.post("/posts", authenticateToken, upload.single("image"), createPost);
router.put("/posts/:id", authenticateToken, upload.single("image"), updatePost);
router.delete("/posts/:id", authenticateToken, deletePost);
// ✅ Fetch only posts related to the authenticated organization
router.get("/posts", authenticateToken, getAllPosts);
router.get("/all", getAllOrganizations); // ✅ Public: Fetch all verified companies

// ✅ Update Company Profile (with Logo)
router.put("/profile", authenticateToken, upload.single("logo"), updateOrganizationProfile);

// ✅ Change Password
router.put("/update-password", authenticateToken, updateOrganizationPassword);


// ✅ Add Social Media Link
router.post("/social-media", authenticateToken, addSocialMediaLink);

// ✅ Add Service
router.post("/services", authenticateToken, addService);

// ✅ Remove Service
router.delete("/services", authenticateToken, removeService);
router.post("/upload-logo", authenticateToken, upload.single("logo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const organization = await Organization.findById(req.user.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // ✅ Save the logo filename in the database
    organization.logo = req.file.filename;
    await organization.save();

    res.status(200).json({ 
      message: "Logo uploaded successfully!", 
      logo: organization.logo // ✅ Send the saved logo in response
    });
  } catch (error) {
    console.error("❌ Error uploading logo:", error);
    res.status(500).json({ message: "Server error while uploading logo." });
  }
});

// ✅ Get specific organization by ID with all details
router.get("/:id", async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .select('companyName logo location operatingCities website socialMedia selectedServices aboutUs');

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Get all posts (blogs) for this organization with complete information
    const posts = await post.find({ organization: req.params.id })
      .select('image caption description createdAt')
      .sort({ createdAt: -1 });

    // Format the response
    const formattedResponse = {
      _id: organization._id,
      companyName: organization.companyName,
      profileImage: organization.logo ? `http://localhost:5000/uploads/${organization.logo}` : null,
      location: organization.location,
      operatingCities: organization.operatingCities,
      website: organization.website,
      socialLinks: organization.socialMedia.reduce((acc, social) => {
        acc[social.platform.toLowerCase()] = social.link;
        return acc;
      }, {}),
      blogs: posts.map(post => ({
        image: post.image ? `http://localhost:5000/uploads/${post.image}` : null,
        caption: post.caption,
        description: post.description,
        date: new Date(post.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      })),
      services: organization.selectedServices.map(service => ({
        name: service,
        logo: `/service-logos/${service.toLowerCase()}.png`
      })),
      about: organization.aboutUs
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
