const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Developer = require("../models/Develpor");
const Question = require('../models/question');
const Student = require("../models/Student");
const Organization = require("../models/Organization");
const Answer = require("../models/answer");
const { SendVerificationCode } = require("../middleware/Email");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Ensure this path is correct
const Post = require("../models/post"); // ✅ Import Post model
const Bid = require('../models/Bid');
const Project = require("../models/Project");
const ProjectHistory = require("../models/ProjectHistory");

const Notification = require("../models/notification");


// Signup handler with verification
const signupOrganization = async (req, res) => {
  try {
    const {
      companyName,
      address,
      branches,
      operatingCities,
      website,
      companyEmail,
      password,
      selectedServices,
    } = req.body;

    // Validate input fields
    if (!companyName || !companyEmail || !password) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if the organization already exists
    const existingOrganization = await Organization.findOne({ companyEmail });
    if (existingOrganization) {
      return res.status(400).json({ message: "Organization already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create new organization
    const newOrganization = new Organization({
      companyName,
      address,
      branches,
      operatingCities,
      website,
      companyEmail,
      password: hashedPassword,
      selectedServices,
      verificationCode, // Store the verification code
      isVerified: false, // Default to not verified
    });

    await newOrganization.save();

    // Send verification code to the organization's email
    await SendVerificationCode(companyEmail, verificationCode);

    res.status(201).json({
      message: "Organization registered successfully. Verification email sent.",
    });
  } catch (error) {
    console.error("Error in signup:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// Verify email handler
const verifyOrganizationEmail = async (req, res) => {
  try {
    const { companyEmail, code } = req.body;

    // Find organization by email and verification code
    const organization = await Organization.findOne({ companyEmail, verificationCode: code });
    if (!organization) {
      return res.status(404).json({ message: "Invalid verification code or email." });
    }

    // Mark as verified and clear the verification code
    organization.isVerified = true;
    organization.verificationCode = undefined;
    await organization.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error in email verification:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login handler
const loginOrganization = async (req, res) => {
  try {
    const { companyEmail, password } = req.body;

    // Validate input fields
    if (!companyEmail || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if the organization exists
    const organization = await Organization.findOne({ companyEmail });
    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // Check if the email is verified
    if (!organization.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify your email." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, organization.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: organization._id, role: "organization" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      organization: {
        id: organization._id,
        companyName: organization.companyName,
        companyEmail: organization.companyEmail,
      },
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


// ✅ Fetch Organization Profile
const getOrganizationProfile = async (req, res) => {
  try {
    const organization = await Organization.findById(req.user.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    res.status(200).json({
      companyName: organization.companyName,
      website: organization.website,
      aboutUs: organization.aboutUs,
      socialMedia: organization.socialMedia || [],
      logo: organization.logo || "",
      selectedServices: organization.selectedServices || [], // ✅ Ensure services are returned
    });
  } catch (error) {
    console.error("❌ Error fetching organization profile:", error);
    res.status(500).json({ message: "Server error." });
  }
};


const createPost = async (req, res) => {
  try {
      const { title, description } = req.body;
      const image = req.file ? req.file.path : null;

      // ✅ Validate required fields
      if (!title || !description) {
          return res.status(400).json({ message: "Title and description are required." });
      }

      const newPost = new Post({
          title,
          description,
          image,
          organization: req.user._id, // Ensure post is linked to the correct organization
      });

      await newPost.save();
      res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
      console.error("❌ Error creating post:", error.message);
      res.status(500).json({ message: "Server error" });
  }
};




// ✅ Fetch All Posts
const getAllPosts = async (req, res) => {
  try {
    // ✅ Ensure only the authenticated organization can fetch their own posts
    if (req.userRole !== "organization") {
      return res.status(403).json({ message: "Forbidden: Only organizations can access posts." });
    }

    // ✅ Fetch posts only for the authenticated organization
    const posts = await Post.find({ organization: req.user._id }).populate("organization", "companyName");

    res.status(200).json(posts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



// ✅ Update Post
const updatePost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.filename : undefined;
    const postId = req.params.id;

    let post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    post.title = title || post.title;
    post.description = description || post.description;
    if (image) post.image = image;

    await post.save();
    res.status(200).json({ message: "Post updated successfully!", post });
  } catch (error) {
    console.error("❌ Error updating post:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete Post
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting post:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
const updateOrganizationProfile = async (req, res) => {
  try {
    const { companyName, website, aboutUs } = req.body;
    let logo = req.file ? req.file.filename : undefined;

    const organization = await Organization.findById(req.user.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    organization.companyName = companyName || organization.companyName;
    organization.website = website || organization.website;
    organization.aboutUs = aboutUs || organization.aboutUs;
    if (logo) organization.logo = logo;

    await organization.save();
    res.status(200).json({ message: "Profile updated successfully", organization });
  } catch (error) {
    console.error("❌ Error updating organization profile:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
const updateOrganizationPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password do not match." });
    }

    const organization = await Organization.findById(req.user.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, organization.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Incorrect old password." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    organization.password = hashedPassword;
    await organization.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error. Try again later." });
  }
};
// ✅ NEW: Get all verified organizations for public listing
const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find().select(
      "companyName operatingCities address selectedServices aboutUs logo"
    );
    res.status(200).json(organizations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Add Social Media Link
const addSocialMediaLink = async (req, res) => {
  try {
    const { platform, link } = req.body;
    const organization = await Organization.findById(req.user.id);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // Validate URL
    if (!link.match(/https?:\/\/(www\.)?\w+\.\w+/)) {
      return res.status(400).json({ message: "Invalid URL format." });
    }

    organization.socialMedia.push({ platform, link });
    await organization.save();

    res.status(201).json({ message: "Social media link added successfully.", organization });
  } catch (error) {
    console.error("❌ Error adding social media link:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

// ✅ Add New Service
const addService = async (req, res) => {
  try {
    console.log("🔹 Incoming Request Body:", req.body); 
    console.log("🔹 User ID:", req.user?.id); 

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized: No user ID found." });
    }

    const { service } = req.body;

    if (!service || typeof service !== "string") {
      return res.status(400).json({ message: "Invalid service. Please provide a valid service name." });
    }

    const organization = await Organization.findById(req.user.id);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // ✅ Fix: Use `selectedServices` instead of `services`
    if (!Array.isArray(organization.selectedServices)) {
      organization.selectedServices = [];
    }

    if (organization.selectedServices.includes(service)) {
      return res.status(400).json({ message: "Service already exists." });
    }

    organization.selectedServices.push(service);
    
    // ✅ Save and Check if it's actually saving
    const savedOrg = await organization.save();
    console.log("✅ Saved Organization Services:", savedOrg.selectedServices);

    res.status(201).json({ message: "✅ Service added successfully.", organization: savedOrg });
  } catch (error) {
    console.error("❌ Error adding service:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};




// ✅ Remove Service
const removeService = async (req, res) => {
  try {
    console.log("🟢 Remove Service Request:", req.body);

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized: No user ID found." });
    }

    const { service } = req.body;
    if (!service) {
      return res.status(400).json({ message: "Service name is required." });
    }

    const organization = await Organization.findById(req.user.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found." });
    }

    // ✅ Fix: Ensure we use `selectedServices`
    if (!Array.isArray(organization.selectedServices)) {
      return res.status(400).json({ message: "No services found." });
    }

    if (!organization.selectedServices.includes(service)) {
      return res.status(400).json({ message: "Service does not exist." });
    }

    // ✅ Remove service from `selectedServices`
    organization.selectedServices = organization.selectedServices.filter((s) => s !== service);
    await organization.save();

    res.status(200).json({ message: "✅ Service removed successfully.", organization });
  } catch (error) {
    console.error("❌ Error removing service:", error);
    res.status(500).json({ message: "Server error." });
  }
};






module.exports = {
  signupOrganization,
  verifyOrganizationEmail, // Add the email verification handler
  loginOrganization,
  getOrganizationProfile,
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  upload,
  updateOrganizationProfile,
  updateOrganizationPassword,
  addSocialMediaLink,
  addService,
  removeService,
  getAllOrganizations,
  
 
};
