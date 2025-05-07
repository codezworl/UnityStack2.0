const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const questionRoutes = require("./routes/questionroutes");
const projectRoutes = require("./routes/projectRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const http = require("http"); // Import the http module
const socketIo = require("socket.io"); // Import socket.io

dotenv.config();

// Initialize the app
const app = express();

// ✅ Middleware
app.use(bodyParser.json());
app.use(express.json()); // ✅ Ensure JSON parsing (Fix for API requests)
app.use(cookieParser()); // ✅ Enable req.cookies
app.use(helmet());

// ✅ Improved CORS Configuration
app.use(cors({
  origin: "http://localhost:3000", // ✅ frontend URL
  credentials: true               // ✅ allow credentials
}));

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
  roomId: String // Add roomId to track private conversations
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
    origin: "http://localhost:3000",
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
  socket.on("joinPrivateChat", async (otherUserId) => {
    try {
      const currentUser = users[socket.id];
      if (!currentUser) {
        throw new Error("User not found");
      }

      const roomId = getRoomId(currentUser.userId, otherUserId);
      
      // Join the private room
      socket.join(roomId);
      
      // Store room information
      if (!privateRooms[roomId]) {
        privateRooms[roomId] = {
          participants: [currentUser.userId, otherUserId],
          messages: []
        };
      }

      console.log(`${currentUser.userName} joined private chat room: ${roomId}`);
      
      // Fetch and send chat history
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

  // Handle sending a message to another user
  socket.on("sendMessage", async (message, toUserId, fromUserId, fromUserName) => {
    try {
      console.log("Received message:", { message, toUserId, fromUserId, fromUserName });
      
      const timestamp = new Date();
      const roomId = getRoomId(fromUserId, toUserId);
      
      const messageData = {
        fromUserId,
        fromUserName,
        message,
        timestamp,
        toUserId,
        roomId
      };

      // Save message to database
      const newMessage = new Message(messageData);
      await newMessage.save();
      
      // Get the recipient's socket ID
      const recipientSocketId = Object.entries(users).find(([_, user]) => user.userId === toUserId)?.[0];
      
      // Send to the private room
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
});

// Update the users endpoint to exclude current user
app.get("/api/users", async (req, res) => {
  try {
    const currentUserId = req.query.currentUserId; // Get current user ID from query
    // Get all online user IDs
    const onlineUserIds = Object.values(users).map(u => u.userId);

    // Fetch users from all collections
    const [students, developers, organizations] = await Promise.all([
      Student.find().select('-password -verificationCode'),
      Developer.find().select('-password -verificationCode'),
      Organization.find().select('-password -verificationCode')
    ]);

    // Combine and format the users with proper names and online status
    const allUsers = [
      ...students.map(s => ({ 
        ...s.toObject(), 
        role: 'student',
        displayName: s.firstName || s.name || 'Student',
        isOnline: onlineUserIds.includes(s._id.toString())
      })),
      ...developers.map(d => ({ 
        ...d.toObject(), 
        role: 'developer',
        displayName: d.firstName || d.name || 'Developer',
        isOnline: onlineUserIds.includes(d._id.toString())
      })),
      ...organizations.map(o => ({ 
        ...o.toObject(), 
        role: 'organization',
        displayName: o.companyName || o.name || 'Organization',
        isOnline: onlineUserIds.includes(o._id.toString())
      }))
    ].filter(user => user._id.toString() !== currentUserId); // Filter out current user

    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.use("/api/students", StudentRoutes);
app.use("/api/organizations", OrganizationRoutes);
app.use("/api/developers", DeveloperRoutes);
app.use("/api", UnifiedLoginRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/projects", projectRoutes);
app.use('/api/payments', paymentRoutes);

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://api.emailjs.com"], // Add this line
        imgSrc: ["'self'", "data:", "blob:", "https://via.placeholder.com"],
        // Include other directives as needed
      },
    },
  })
);

// Update the security headers middleware
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https: http:; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://js.stripe.com/basil/; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.stripe.com http://localhost:*; " +
    "frame-src 'self' https://js.stripe.com; " +
    "frame-ancestors 'self'; " +
    "form-action 'self' https://api.stripe.com;"
  );
  
  // Update COEP and COOP headers
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  
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
  .then(() => {
    console.log("✅ MongoDB connected successfully.");
    const PORT = process.env.PORT || 5000;

    // Start the server with Socket.io
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
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
