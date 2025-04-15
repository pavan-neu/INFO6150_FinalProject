const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: [
        "concert",
        "conference",
        "exhibition",
        "workshop",
        "sports",
        "festival",
        "other",
      ],
    },
    imageUrl: {
      type: String,
      required: [true, "Event image is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Event start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "Event end date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Event start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "Event end time is required"],
    },
    location: {
      venue: {
        type: String,
        required: [true, "Venue name is required"],
      },
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      state: {
        type: String,
        required: [true, "State is required"],
      },
      zipCode: {
        type: String,
        required: [true, "Zip code is required"],
      },
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalTickets: {
      type: Number,
      required: [true, "Total available tickets is required"],
      min: [1, "Must have at least 1 ticket available"],
    },
    ticketsRemaining: {
      type: Number,
      min: 0,
    },
    ticketPrice: {
      type: Number,
      required: [true, "Ticket price is required"],
      min: [0, "Ticket price cannot be negative"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "cancelled"],
      default: "active",
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for tickets sold
eventSchema.virtual("ticketsSold").get(function () {
  return this.totalTickets - this.ticketsRemaining;
});

// Pre-save middleware to set ticketsRemaining equal to totalTickets for new events
eventSchema.pre("save", function (next) {
  if (this.isNew) {
    this.ticketsRemaining = this.totalTickets;
  }
  next();
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
