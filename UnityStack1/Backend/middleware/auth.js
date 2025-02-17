const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Developer = require("../models/Develpor");
const Organization = require("../models/Organization");

const authenticateToken = async (req, res, next) => {
  try {
    // ✅ Extract token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    console.log("🔹 Extracted Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    // ✅ Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Check if the user is a Student, Developer, or Organization
    let user = await Student.findById(decoded.id).select("-password");
    let role = "student"; // Default role

    if (!user) {
      user = await Developer.findById(decoded.id).select("-password");
      role = "developer";
    }

    if (!user) {
      user = await Organization.findById(decoded.id).select("-password");
      role = "organization";
    }

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Invalid user." });
    }

    req.user = user; // Attach user object to request
    req.userRole = role; // Attach role to request object

    console.log(`✅ Authenticated as ${role}:`, user.email);
    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(403).json({ message: "Forbidden: Invalid token." });
  }
};

module.exports = authenticateToken;
