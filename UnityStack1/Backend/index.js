const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Import routes
const StudentRoutes = require("./routes/StudentRoutes");
const OrganizationRoutes = require("./routes/organizationRoutes");
const DeveloperRoutes = require("./routes/develporRoutes"); // Added developer routes

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// API Routes
app.use("/api/students", StudentRoutes);
app.use("/api/organizations", OrganizationRoutes);
app.use("/api/developers", DeveloperRoutes); // Added developer route handler

// Serve Frontend (React App)
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// Fallback Route for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
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
