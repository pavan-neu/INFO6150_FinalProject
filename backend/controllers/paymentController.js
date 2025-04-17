const stripe = process.env.STRIPE_SECRET_KEY 
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : null;

// Log whether Stripe is properly initialized
console.log('Stripe initialized:', !!stripe);
const Transaction = require('../models/transactionModel');
const Ticket = require('../models/ticketModel');



// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
  try {
    const { ticketIds, amount } = req.body;
    
    if (!ticketIds || !ticketIds.length || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Verify all tickets exist and belong to the user
    const tickets = await Ticket.find({
      _id: { $in: ticketIds },
      user: req.user._id,
      status: 'reserved'
    }).populate('event', 'title');
    
    if (tickets.length !== ticketIds.length) {
      return res.status(400).json({ 
        message: 'One or more tickets are invalid or not in reserved status' 
      });
    }
    
    // Check if any tickets have expired reservations
    const now = new Date();
    const expiredTickets = tickets.filter(
      ticket => ticket.reservationExpiry && ticket.reservationExpiry < now
    );
    
    if (expiredTickets.length > 0) {
      return res.status(400).json({ 
        message: 'One or more ticket reservations have expired' 
      });
    }
    
    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe works with cents
      currency: 'usd',
      metadata: {
        ticketIds: ticketIds.join(','),
        userId: req.user._id.toString()
      }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
};

// @desc    Handle payment success
// @route   POST /api/payments/success
// @access  Private
const handlePaymentSuccess = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Payment intent ID required' });
    }
    
    // Verify the payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment has not succeeded' });
    }
    
    // Get ticket IDs from metadata
    const ticketIds = paymentIntent.metadata.ticketIds.split(',');
    const userId = paymentIntent.metadata.userId;
    
    // Verify user matches
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    // Update ticket status to paid
    await Ticket.updateMany(
      { _id: { $in: ticketIds } },
      { status: 'paid' }
    );
    
    // Create transaction records
    const tickets = await Ticket.find({ _id: { $in: ticketIds } });
    
    const transactions = [];
    
    for (const ticket of tickets) {
      const transaction = await Transaction.create({
        user: req.user._id,
        event: ticket.event,
        ticket: ticket._id,
        amount: ticket.price,
        paymentMethod: 'credit_card',
        paymentId: paymentIntentId,
        status: 'completed'
      });
      
      transactions.push(transaction);
    }
    
    res.status(201).json({
      message: 'Payment processed successfully',
      transactions: transactions.map(t => t._id)
    });
  } catch (error) {
    console.error('Payment success error:', error);
    res.status(500).json({ message: 'Error processing payment success' });
  }
};

// @desc    Handle webhook events from Stripe
// @route   POST /api/payments/webhook
// @access  Public
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle specific event types
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    // Process payment success (similar to handlePaymentSuccess but without auth check)
    console.log('PaymentIntent succeeded:', paymentIntent.id);
    
    // Get ticket IDs from metadata
    const ticketIds = paymentIntent.metadata.ticketIds?.split(',');
    
    if (ticketIds && ticketIds.length) {
      try {
        // Update ticket status to paid if not already done
        await Ticket.updateMany(
          { _id: { $in: ticketIds }, status: 'reserved' },
          { status: 'paid' }
        );
      } catch (error) {
        console.error('Webhook ticket update error:', error);
      }
    }
  }
  
  res.json({ received: true });
};

module.exports = {
  createPaymentIntent,
  handlePaymentSuccess,
  handleWebhook
};