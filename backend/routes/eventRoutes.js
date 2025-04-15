// routes/eventRoutes.js
const express = require("express");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  cancelEvent,
  getEventsByOrganizer,
  getMyEvents,
  searchEvents,
  toggleEventFeature,
  getFeaturedEvents,
  getUpcomingEvents,
  uploadEventImage,
} = require("../controllers/eventController");
const { protect, admin, organizer } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Public routes
router.get("/", getEvents);

// Specific named routes (come before parameter routes)
router.get("/featured", getFeaturedEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/search", searchEvents);
router.get("/my-events", protect, getMyEvents);
router.get("/organizer/:organizerId", getEventsByOrganizer);

// Post route for creating a new event
router.post("/", protect, createEvent);

// Parameter routes (must come after specific routes)
router.get("/:id", getEventById);
router.put("/:id", protect, updateEvent);
router.put("/:id/cancel", protect, cancelEvent);
router.put("/:id/feature", protect, admin, toggleEventFeature);
router.post("/:id/upload", protect, upload.single("image"), uploadEventImage);

module.exports = router;
