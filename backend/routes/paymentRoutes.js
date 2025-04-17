const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { createPaymentIntent, handlePaymentSuccess, handleWebhook } = require('../controllers/paymentController');

const router = express.Router();

// Protected routes (require authentication)
router.post('/create-intent', protect, createPaymentIntent);
router.post('/success', protect, handlePaymentSuccess);

// Public route for Stripe webhook - this is routed differently in server.js
router.post('/webhook', handleWebhook);

module.exports = router;