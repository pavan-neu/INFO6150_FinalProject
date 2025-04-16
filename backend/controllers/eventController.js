// controllers/eventController.js
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const Event = require("../models/eventModel");
const User = require("../models/userModel");

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Organizer
const createEvent = async (req, res) => {
  try {
    // Check if user is an organizer or admin
    if (req.user.role !== "organizer" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to create events" });
    }

    const {
      title,
      description,
      category,
      imageUrl,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      totalTickets,
      ticketPrice,
      tags,
    } = req.body;

    // Validate dates
    const currentDate = new Date();
    const eventStartDate = new Date(startDate);

    if (eventStartDate < currentDate) {
      return res
        .status(400)
        .json({ message: "Event start date cannot be in the past" });
    }

    const eventEndDate = new Date(endDate);
    if (eventEndDate < eventStartDate) {
      return res
        .status(400)
        .json({ message: "Event end date cannot be before start date" });
    }

    // Create event
    const event = await Event.create({
      title,
      description,
      category,
      imageUrl,
      startDate,
      endDate,
      startTime,
      endTime,
      location,
      organizer: req.user._id,
      totalTickets,
      ticketPrice,
      tags: tags || [],
    });

    if (event) {
      // Return the event ID along with the success message
      res.status(201).json({
        message: "Event created successfully",
        eventId: event._id,
      });
    } else {
      res.status(400).json({ message: "Invalid event data" });
    }
  } catch (error) {
    console.error("Event creation error:", error.message);
    res.status(500).json({ message: "Server error creating event" });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Only get active events
    const events = await Event.find({ status: "active" })
      .populate("organizer", "name username")
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const count = await Event.countDocuments({ status: "active" });

    res.json({
      events,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  } catch (error) {
    console.error("Get events error:", error.message);
    res.status(500).json({ message: "Server error retrieving events" });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name username"
    );

    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    console.error("Get event error:", error.message);
    res.status(500).json({ message: "Server error retrieving event" });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Organizer
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is the organizer or admin
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this event" });
    }

    // Check if event is already cancelled
    if (event.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Cannot update a cancelled event" });
    }

    // Use findByIdAndUpdate to avoid validation issues
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({ message: "Event updated successfully" });
  } catch (error) {
    console.error("Update event error:", error.message);
    res.status(500).json({ message: "Server error updating event" });
  }
};

// @desc    Cancel event
// @route   PUT /api/events/:id/cancel
// @access  Private/Organizer
const cancelEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is the organizer or admin
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this event" });
    }

    // Check if event is already cancelled
    if (event.status === "cancelled") {
      return res.status(400).json({ message: "Event is already cancelled" });
    }

    // Update status to cancelled
    event.status = "cancelled";
    await event.save();

    res.json({ message: "Event cancelled successfully" });
  } catch (error) {
    console.error("Cancel event error:", error.message);
    res.status(500).json({ message: "Server error cancelling event" });
  }
};

// @desc    Get events by organizer
// @route   GET /api/events/organizer/:organizerId
// @access  Public
const getEventsByOrganizer = async (req, res) => {
  try {
    const organizerId = req.params.organizerId;

    // Validate if organizer exists
    const organizerExists = await User.findById(organizerId);
    if (!organizerExists) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get active events by the organizer
    const events = await Event.find({
      organizer: organizerId,
      status: "active",
    })
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const count = await Event.countDocuments({
      organizer: organizerId,
      status: "active",
    });

    res.json({
      events,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  } catch (error) {
    console.error("Get events by organizer error:", error.message);
    res.status(500).json({ message: "Server error retrieving events" });
  }
};

// @desc    Get my events (organizer's events)
// @route   GET /api/events/my-events
// @access  Private/Organizer
const getMyEvents = async (req, res) => {
  try {
    // Check if user is an organizer or admin
    if (req.user.role !== "organizer" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get all events by the logged-in organizer (including cancelled)
    const events = await Event.find({ organizer: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const count = await Event.countDocuments({ organizer: req.user._id });

    res.json({
      events,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  } catch (error) {
    console.error("Get my events error:", error.message);
    res.status(500).json({ message: "Server error retrieving events" });
  }
};

// @desc    Search events
// @route   GET /api/events/search
// @access  Public
const searchEvents = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search in title, description, and tags
    const events = await Event.find({
      status: "active",
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    })
      .populate("organizer", "name username")
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const count = await Event.countDocuments({
      status: "active",
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    });

    res.json({
      events,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  } catch (error) {
    console.error("Search events error:", error.message);
    res.status(500).json({ message: "Server error searching events" });
  }
};

// @desc    Feature/unfeature event
// @route   PUT /api/events/:id/feature
// @access  Private/Admin
const toggleEventFeature = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Toggle the featured status
    event.isFeatured = !event.isFeatured;
    await event.save();

    const action = event.isFeatured ? "featured" : "unfeatured";
    res.json({ message: `Event ${action} successfully` });
  } catch (error) {
    console.error("Toggle feature error:", error.message);
    res.status(500).json({ message: "Server error updating feature status" });
  }
};

// @desc    Get featured events
// @route   GET /api/events/featured
// @access  Public
const getFeaturedEvents = async (req, res) => {
  try {
    const featuredEvents = await Event.find({
      isFeatured: true,
      status: "active",
    })
      .populate("organizer", "name username")
      .sort({ startDate: 1 })
      .limit(10);

    res.json(featuredEvents);
  } catch (error) {
    console.error("Get featured events error:", error.message);
    res
      .status(500)
      .json({ message: "Server error retrieving featured events" });
  }
};

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Public
const getUpcomingEvents = async (req, res) => {
  try {
    const today = new Date();

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const upcomingEvents = await Event.find({
      startDate: { $gte: today },
      status: "active",
    })
      .populate("organizer", "name username")
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const count = await Event.countDocuments({
      startDate: { $gte: today },
      status: "active",
    });

    res.json({
      events: upcomingEvents,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });
  } catch (error) {
    console.error("Get upcoming events error:", error.message);
    res
      .status(500)
      .json({ message: "Server error retrieving upcoming events" });
  }
};

// @desc    Upload event image
// @route   POST /api/events/:id/upload
// @access  Private/Organizer
const uploadEventImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is the organizer or admin
    if (
      event.organizer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this event" });
    }

    // Delete old event image if it exists and is not the placeholder
    if (event.imageUrl && event.imageUrl !== "placeholder.jpg") {
      const oldImagePath = path.join(__dirname, "..", event.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update image URL
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { imageUrl: req.file.path },
      { new: true, runValidators: false }
    );

    res.json({ message: "Event image uploaded successfully" });
  } catch (error) {
    console.error("Event image upload error:", error.message);
    res.status(500).json({ message: "Server error uploading event image" });
  }
};

module.exports = {
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
};
