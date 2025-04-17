const express = require("express");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Present' : 'Missing');

const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const fs = require("fs");
const path = require("path");

// Import routes
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
// Add this new import
const paymentRoutes = require("./routes/paymentRoutes");



// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());

// Special handling for Stripe webhook - must come before express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Standard JSON parsing for other routes
app.use(express.json());

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Create uploads directories if they don't exist
const uploadsDir = "./uploads";
const profilesDir = "./uploads/profiles";
const eventsDir = "./uploads/events";

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}
if (!fs.existsSync(eventsDir)) {
  fs.mkdirSync(eventsDir, { recursive: true });
}

// Make uploads folder static
app.use("/uploads", express.static("uploads"));

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/transactions", transactionRoutes);
// Add new payment routes
app.use("/api/payments", paymentRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("EventEase API is running...");
});

// Initialize cron jobs in production and development, but not in test environment
if (process.env.NODE_ENV !== 'test') {
  console.log("Initializing ticket reservation expiration system...");
  require('./crons/ticketReservations');
}

// Custom error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});