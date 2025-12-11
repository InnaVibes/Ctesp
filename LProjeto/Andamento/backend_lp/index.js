require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 4000;

// Import routes
const clientsRoutes = require("./routes/clients");
const adminsRoutes = require("./routes/admins");
const loginRoutes = require("./routes/login");
const ownerRoutes = require("./routes/owner");
const usersRoutes = require("./routes/users");
const notificationsRoutes = require("./routes/notifications");
const emailRoutes = require("./routes/email");
const authRoutes = require("./routes/authRoutes");
const gamesRoutes = require("./routes/gamesRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");

// MongoDB Connection (Simplified)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/game_store';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB!');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (basic)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Register routes
app.use("/clients", clientsRoutes); 
app.use("/admins", adminsRoutes); 
app.use("/login", loginRoutes);
app.use("/owner", ownerRoutes);
app.use("/users", usersRoutes);
app.use("/notifications", notificationsRoutes()); 
app.use("/email", emailRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/purchases", purchaseRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ 
    success: true,
    message: "Backend LP Games API",
    version: "2.0.0",
    documentation: {
      auth: "/api/auth - Authentication endpoints",
      games: "/api/games - Game catalog and search",
      purchases: "/api/purchases - Purchase management",
      users: "/users - User management (legacy)",
      clients: "/clients - Client management (legacy)",
      admins: "/admins - Admin management (legacy)",
      owner: "/owner - Owner management (legacy)",
      login: "/login - Login (legacy)",
      notifications: "/notifications - Notification system",
      email: "/email - Email service"
    },
    database: {
      connected: mongoose.connection.readyState === 1,
      name: mongoose.connection.name
    }
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: {
      connected: mongoose.connection.readyState === 1,
      name: mongoose.connection.name
    }
  });
});

// Handle 404 - Not found
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: "Route not found",
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ 
    success: false,
    error: "Internal server error",
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Closing HTTP server...');
  server.close(() => {
    console.log('💤 HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('💤 MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Documentation: http://localhost:${PORT}/`);
  console.log(`❤️  Health Check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
