const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

dotenv.config();

// Initialize the app
const app = express();

// ✅ Middleware
app.use(bodyParser.json());
app.use(express.json()); // ✅ Ensure JSON parsing (Fix for API requests)
app.use(cookieParser()); // ✅ Enable req.cookies
app.use(helmet());

// ✅ Improved CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // ✅ Allow credentials (fixes authentication issues)
  })
);

app.use(cookieParser()); // ✅ Ensure cookie-parser is used

// ✅ Static file serving (uploads & frontend)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// ✅ Rate limiting (only for API routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use("/api", limiter); // ✅ Apply rate limiting only to API routes

// ✅ API Routes
const StudentRoutes = require("./routes/StudentRoutes");
const OrganizationRoutes = require("./routes/organizationRoutes");
const DeveloperRoutes = require("./routes/develporRoutes"); // ✅ Ensure this file exists
const UnifiedLoginRoutes = require("./routes/loginroute");

app.use("/api/students", StudentRoutes);
app.use("/api/organizations", OrganizationRoutes);
app.use("/api/developers", DeveloperRoutes);
app.use("/api", UnifiedLoginRoutes);


app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", "https://via.placeholder.com"],
      },
    },
  })
);



// ✅ Ensure `/api/developers` route exists in `developerRoutes.js`
const Developer = require("./models/Develpor"); // ✅ Import Developer model
app.get("/api/developers", async (req, res) => {
  try {
    const developers = await Developer.find().select("-password -verificationCode");

    if (!developers || developers.length === 0) {
      return res.status(404).json({ message: "No developers found." });
    }

    res.status(200).json(developers);
  } catch (error) {
    console.error("Error fetching developers:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// ✅ Handle undefined API routes properly
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// ✅ React Router Fallback for SPA (Serve Frontend)
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ✅ Connect to MongoDB and Start Server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected successfully.");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  });

// ✅ Graceful Shutdown on Ctrl+C
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");
  await mongoose.disconnect();
  process.exit(0);
});
