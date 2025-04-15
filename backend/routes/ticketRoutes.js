// routes/ticketRoutes.js
const express = require("express");
const {
  bookTicket,
  getMyTickets,
  getTicketById,
  cancelTicket,
  verifyTicket,
  markTicketAsUsed,
  getTicketsForEvent,
} = require("../controllers/ticketController");
const { protect, admin, organizer } = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected routes
router.post("/", protect, bookTicket);
router.get("/my-tickets", protect, getMyTickets);
router.get("/event/:eventId", protect, getTicketsForEvent);
router.get("/:id", protect, getTicketById);
router.put("/:id/cancel", protect, cancelTicket);
router.get("/:id/verify", protect, verifyTicket);
router.put("/:id/mark-used", protect, markTicketAsUsed);

module.exports = router;
