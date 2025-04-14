const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: true,
      unique: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['reserved', 'paid', 'cancelled', 'used'],
      default: 'reserved'
    },
    qrCode: {
      type: String
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Generate unique ticket number before saving
ticketSchema.pre('save', async function(next) {
  if (this.isNew) {
    const prefix = 'EVTEZ';
    const random = Math.floor(100000 + Math.random() * 900000).toString();
    const timestamp = Date.now().toString().slice(-6);
    this.ticketNumber = `${prefix}-${random}-${timestamp}`;
  }
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;