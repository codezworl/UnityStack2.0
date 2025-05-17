const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Developer = require("../models/Develpor");
const Organization = require("../models/Organization");
const Admin = require("../models/admin");

const authenticateToken = async (req, res, next) => {
  try {
    // ✅ Extract token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.warn("❌ Unauthorized Access: No token provided.");
      return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    // ✅ Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;
    let role = null;

    // ✅ Check if the user is a Student
    user = await Student.findById(decoded.id).select("-password");
    if (user) role = "student";

    // ✅ Check if the user is a Developer
    if (!user) {
      user = await Developer.findById(decoded.id).select("-password");
      if (user) role = "developer";
    }

    // ✅ Check if the user is an Organization
    if (!user) {
      user = await Organization.findById(decoded.id).select("-password");
      if (user) {
        role = "organization";
        req.organizationId = user._id; // Attach organization ID
      }
    }

    // ✅ Check if the user is an Admin
    if (!user) {
      user = await Admin.findById(decoded.id).select("-password");
      if (user) role = "admin";
    }

    if (!user) {
      console.warn("❌ Unauthorized Access: User not found.");
      return res.status(401).json({ message: "Unauthorized: Invalid user." });
    }

    req.user = user; // Attach user object to request
    req.userRole = role; // Attach role to request object

    console.log(`✅ Authenticated as ${role}:`, user.email || user.name);
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(403).json({ message: "Forbidden: Invalid token." });
  }
};

module.exports = authenticateToken;
