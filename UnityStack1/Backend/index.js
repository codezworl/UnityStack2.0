const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
//stripe
const questionRoutes = require("./routes/questionroutes");
const projectRoutes = require("./routes/projectRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const http = require("http"); // Import the http module
const socketIo = require("socket.io"); // Import socket.io
const adminRoutes = require('./routes/adminroutes');
const adminController = require('./Controllers/admincontroller');
const feedbackRoutes = require('./routes/feedbackRoutes');
const reviewRoutes = require("./routes/reviewRoutes");
const sessionRoutes = require('./routes/sessionRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const requestRoutes = require('./routes/requestRoutes');

dotenv.config();

// Initialize the app
const app = express();

// ✅ Middleware
app.use(bodyParser.json());
app.use(express.json()); // ✅ Ensure JSON parsing (Fix for API requests)
app.use(cookieParser()); // ✅ Enable req.cookies
app.use(helmet({
  contentSecurityPolicy: false // Disable helmet's CSP, use manual CSP below
}));

// ✅ Improved CORS Configuration
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://192.168.1.5:3000",
    "http://192.168.1.7:3000",
    "http://192.168.1.5:5000",
    "http://192.168.1.7:5000"
  ], // ✅ Allow both localhost and local IP addresses
  credentials: true               // ✅ allow credentials
}));

app.use(cookieParser()); // ✅ Ensure cookie-parser is used

// ✅ Static file serving (uploads & frontend)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

// ✅ Rate limiting (only for API routes) - Disabled in development
const isDevelopment = process.env.NODE_ENV !== 'production';

let limiter, sessionLimiter;

if (isDevelopment) {
  // No rate limiting in development
  limiter = (req, res, next) => next();
  sessionLimiter = (req, res, next) => next();
  console.log('🚀 Rate limiting disabled for development');
} else {
  // Rate limiting for production
  limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000, // Increased for development and session functionality
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  // More lenient rate limiter for session routes
  sessionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50000, // Very high limit for session functionality
    message: 'Too many session requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  console.log('🛡️ Rate limiting enabled for production');
}

// Apply rate limiting to all routes except file uploads and session-related routes
app.use((req, res, next) => {
  if (req.path.includes('/save-recording') || 
      req.path.includes('/socket.io')) {
    next();
  } else if (req.path.includes('/sessions') || req.path.includes('/api/sessions')) {
    sessionLimiter(req, res, next);
  } else {
    limiter(req, res, next);
  }
});

// ✅ API Routes
const StudentRoutes = require("./routes/StudentRoutes");
const OrganizationRoutes = require("./routes/organizationRoutes");
const DeveloperRoutes = require("./routes/develporRoutes"); // ✅ Ensure this file exists
const UnifiedLoginRoutes = require("./routes/loginroute");

// Add this before the routes
const Student = require("./models/Student");
const Developer = require("./models/Develpor");
const Organization = require("./models/Organization");

// Store online users and their rooms
let users = {};
let privateRooms = {};

// Add Message Schema
const messageSchema = new mongoose.Schema({
  fromUserId: String,
  fromUserName: String,
  toUserId: String,
  message: String,
  timestamp: Date,
  roomId: String, // Add roomId to track private conversations
  seen: { type: Boolean, default: false }
});

const Message = mongoose.model('Message', messageSchema);

// Function to generate a unique room ID for two users
const getRoomId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('_');
};

// When a user connects, handle their session
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://192.168.1.5:3000", 
      "http://192.168.1.7:3000",
      "http://192.168.1.5:5000",
      "http://192.168.1.7:5000"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Listen for joining a room based on user role
  socket.on("joinRoom", async (userId, role, userName) => {
    try {
      // Store user info with socket ID
      users[socket.id] = { userId, role, userName, socketId: socket.id };
      
      // Join personal room
      socket.join(userId);
      
      console.log(`${userName} (${role}) joined the chat`);
      
      // Broadcast to all clients that a new user joined
      io.emit('userJoined', { userId, role, userName });
    } catch (error) {
      console.error("Error in joinRoom:", error);
      socket.emit("error", "Failed to join room");
    }
  });

 // Handle joining a private chat room
socket.on("joinPrivateChat", async (roomId) => {
  try {
    const currentUser = users[socket.id];
    if (!currentUser) {
      throw new Error("User not found");
    }

    socket.join(roomId); // Join the private room

    // Fetch and send chat history for the two users in this private room
    const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
    socket.emit("chatHistory", messages.map(msg => ({
      ...msg.toObject(),
      timestamp: msg.timestamp.toLocaleTimeString()
    })));
  } catch (error) {
    console.error("Error joining private chat:", error);
    socket.emit("error", "Failed to join private chat");
  }
});



  

// Handle sending a message to another user in the private chat room
socket.on("sendMessage", async (message, toUserId, fromUserId, fromUserName, roomId) => {
  try {
    const timestamp = new Date();
    const messageData = { fromUserId, fromUserName, message, timestamp, toUserId, roomId };

    // Save the message to the database
    const newMessage = new Message(messageData);
    await newMessage.save();

    // Emit the message to the private chat room
    io.to(roomId).emit("receiveMessage", {
      ...messageData,
      timestamp: timestamp.toLocaleTimeString()
    });
  } catch (error) {
    console.error("Error saving/sending message:", error);
    socket.emit("error", "Failed to send message");
  }
});




  // Handle fetching chat history
  socket.on("fetchMessages", async (fromUserId, toUserId) => {
    try {
      console.log("Fetching messages between:", fromUserId, toUserId);
      const roomId = getRoomId(fromUserId, toUserId);
      
      const messages = await Message.find({ roomId }).sort({ timestamp: 1 });

      socket.emit("chatHistory", messages.map(msg => ({
        ...msg.toObject(),
        timestamp: msg.timestamp.toLocaleTimeString()
      })));
    } catch (error) {
      console.error("Error fetching messages:", error);
      socket.emit("error", "Failed to fetch messages");
    }
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    const user = users[socket.id];
    if (user) {
      console.log(`${user.userName} (${user.role}) disconnected`);
      // Broadcast to all clients that user left
      io.emit('userLeft', { userId: user.userId, role: user.role, userName: user.userName });
      delete users[socket.id];
    }
  });

  // Mark messages as seen when a user opens a chat
  socket.on("markMessagesAsSeen", async ({ roomId, userId }) => {
    try {
      await Message.updateMany(
        { roomId, toUserId: userId, seen: false },
        { $set: { seen: true } }
      );
      socket.emit("messagesMarkedAsSeen", { roomId });
      // Notify the other user in the room to update their unread counts
      socket.to(roomId).emit("updateUnreadCounts");
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  });

  // --- SESSION VIDEO CALL SIGNALING EVENTS ---
  // Join a session room
  socket.on('join-session-room', ({ sessionId, userId, role }) => {
    console.log(`[Socket.IO] User ${userId} (${role}) joining session room ${sessionId}`);
    socket.join(sessionId);
    socket.sessionId = sessionId;
    socket.userId = userId;
    socket.role = role;
  });

  // Code editor events
  socket.on('code-change', ({ sessionId, code, language }) => {
    console.log(`[Socket.IO] Code change in session ${sessionId}`);
    socket.to(sessionId).emit('code-change', { code, language });
  });

  socket.on('editor-toggle', ({ sessionId, show }) => {
    console.log(`[Socket.IO] Editor toggle in session ${sessionId}: ${show}`);
    socket.to(sessionId).emit('editor-toggle', { show });
  });

  // Student asks to join
  socket.on('ask-to-join', ({ sessionId, studentName }) => {
    console.log(`[Socket.IO] Student ${studentName} requesting to join session ${sessionId}`);
    // Broadcast to all clients in the session room except the sender
    socket.to(sessionId).emit('join-request', { studentName });
  });

  // Developer accepts
  socket.on('accept-join', ({ sessionId }) => {
    console.log(`[Socket.IO] Developer accepting join request for session ${sessionId}`);
    // Broadcast to all clients in the session room
    io.to(sessionId).emit('join-accepted');
  });

  // WebRTC signaling
  socket.on('signal', ({ sessionId, data }) => {
    console.log(`[Socket.IO] Signal received in session ${sessionId}`, data.type);
    socket.to(sessionId).emit('signal', data);
  });

  // Early end request (when someone wants to end call before session time)
  socket.on('early-end-request', ({ sessionId, from, to }) => {
    console.log(`[Socket.IO] Early end request from ${from} to ${to} for session ${sessionId}`);
    socket.to(sessionId).emit('early-end-request', { from });
  });

  // Reject early end request
  socket.on('reject-early-end', ({ sessionId }) => {
    console.log(`[Socket.IO] Early end request rejected for session ${sessionId}`);
    io.to(sessionId).emit('early-end-rejected');
  });

  // Accept early end request
  socket.on('accept-early-end', ({ sessionId }) => {
    console.log(`[Socket.IO] Early end request accepted for session ${sessionId}`);
    io.to(sessionId).emit('early-end-accepted');
  });

  // End session request (for normal session end)
  socket.on('end-session-request', ({ sessionId }) => {
    console.log(`[Socket.IO] End session request received for session ${sessionId}`);
    socket.to(sessionId).emit('end-session-request');
  });

  // Confirm session end
  socket.on('confirm-end-session', ({ sessionId }) => {
    console.log(`[Socket.IO] Session ${sessionId} ended`);
    io.to(sessionId).emit('session-ended');
  });
});

// Update the users endpoint to exclude current user

app.get("/api/users", async (req, res) => {
  try {
    const { currentUserId } = req.query;
    
    if (!currentUserId) {
      console.log("No currentUserId provided");
      return res.status(400).json({ message: "Current user ID is required" });
    }

    console.log("Fetching users, excluding:", currentUserId);

    // Convert currentUserId to ObjectId
    let currentUserObjectId;
    try {
      currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);
    } catch (error) {
      console.error("Invalid user ID format:", error);
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const onlineUserIds = Object.values(users).map(u => u.userId);

    // Fetch users from all collections, excluding the current user
    const [students, developers, organizations] = await Promise.all([
      Student.find({ _id: { $ne: currentUserObjectId } })
        .select('firstName lastName email profileImage'),
      Developer.find({ _id: { $ne: currentUserObjectId } })
        .select('firstName lastName email profileImage'),
      Organization.find({ _id: { $ne: currentUserObjectId } })
        .select('companyName companyEmail logo')
    ]);

    console.log("Found students:", students.length);
    console.log("Found developers:", developers.length);
    console.log("Found organizations:", organizations.length);

    // Combine all users with proper display names
    const allUsers = [
      ...students.map(s => ({
        _id: s._id,
        role: 'student',
        displayName: `${s.firstName} ${s.lastName || ''}`.trim(),
        email: s.email,
        profileImage: s.profileImage,
        isOnline: onlineUserIds.includes(s._id.toString())
      })),
      ...developers.map(d => ({
        _id: d._id,
        role: 'developer',
        displayName: `${d.firstName} ${d.lastName || ''}`.trim(),
        email: d.email,
        profileImage: d.profileImage,
        isOnline: onlineUserIds.includes(d._id.toString())
      })),
      ...organizations.map(o => ({
        _id: o._id,
        role: 'organization',
        displayName: o.companyName,
        email: o.companyEmail,
        profileImage: o.logo,
        isOnline: onlineUserIds.includes(o._id.toString())
      }))
    ];

    console.log("Total users found:", allUsers.length);
    console.log("First few users:", allUsers.slice(0, 3));
    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Add an API endpoint to get unread message count for a user
app.get("/api/unread-count/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const count = await Message.countDocuments({ toUserId: userId, seen: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch unread count" });
  }
});

// Get per-user unread counts for the current user
app.get("/api/unread-counts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // Aggregate unread counts grouped by fromUserId
    const counts = await Message.aggregate([
      { $match: { toUserId: userId, seen: false } },
      { $group: { _id: "$fromUserId", count: { $sum: 1 } } }
    ]);
    // Convert to { userId: count, ... }
    const result = {};
    counts.forEach(c => { result[c._id] = c.count; });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch unread counts" });
  }
});

app.use("/api/students", StudentRoutes);
app.use("/api/organizations", OrganizationRoutes);
app.use("/api/developers", DeveloperRoutes);
app.use("/api", UnifiedLoginRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/reviews", reviewRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use("/api/submissions", submissionRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/requests', requestRoutes);

// Set a single, comprehensive CSP header for Stripe and Monaco Editor
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https: http:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://cdn.jsdelivr.net https://unpkg.com; " +
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.stripe.com https://api.emailjs.com http://localhost:* http://192.168.*:* https://js.stripe.com https://cdn.jsdelivr.net https://unpkg.com; " +
    "frame-src 'self' https://js.stripe.com; " +
    "frame-ancestors 'self'; " +
    "form-action 'self' https://api.stripe.com;"
  );
  next();
});

// ✅ Ensure `/api/developers` route exists in `developerRoutes.js`
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
  .then(async () => {
    console.log("✅ MongoDB connected successfully.");
    // Seed admin users
    await adminController.seedAdmins();
    const PORT = process.env.PORT || 5000;

    // Start the server with Socket.io
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🌐 Server accessible on network at http://192.168.1.5:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  });

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");
  await mongoose.disconnect();
  process.exit(0);
});