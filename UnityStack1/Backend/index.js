const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Import routes
const StudentRoutes = require("./routes/StudentRoutes");
const OrganizationRoutes = require("./routes/organizationRoutes");
const DeveloperRoutes = require("./routes/develporRoutes"); // Correct route file name
const UnifiedLoginRoutes = require("./routes/loginroute");

dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(helmet());
app.use(cors({ origin: "*", credentials: true })); // Adjust CORS for production
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// API Routes
app.use("/api/students", StudentRoutes);
app.use("/api/organizations", OrganizationRoutes);
app.use("/api/developers", DeveloperRoutes); // Ensure this matches your frontend call
app.use("/api", UnifiedLoginRoutes); // Unified login route

// Handle undefined API routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Serve Frontend (React App)
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// Fallback Route for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully.");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.disconnect();
  process.exit(0);
});
