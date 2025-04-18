// src/components/events/EventCard.js
import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatters";
import "./EventCard.css";

const EventCard = ({ event }) => {
  // Define your placeholder image path
  const placeholderImage = "/images/event-placeholder.png";
  const BACKEND_URL = "https://your-backend-name.onrender.com";

  // Fallback values for missing data
  const {
    _id = "",
    title = "Untitled Event",
    imageUrl = null,
    category = "Other",
    startDate = new Date().toISOString(),
    startTime = "00:00",
    location = { venue: "TBD" },
    ticketPrice = 0,
    ticketsRemaining = 0,
    totalTickets = 0,
    isFeatured = false,
  } = event || {};

  // Calculate percentage of tickets sold
  const percentageSold =
    ((totalTickets - ticketsRemaining) / totalTickets) * 100;

  // Determine availability status
  let availabilityStatus = "Available";
  let availabilityVariant = "success";

  if (ticketsRemaining === 0) {
    availabilityStatus = "Sold Out";
    availabilityVariant = "danger";
  } else if (percentageSold >= 80) {
    availabilityStatus = "Selling Fast";
    availabilityVariant = "warning";
  }

  // Format date for display
  const eventDate = new Date(startDate);
  const day = eventDate.getDate();
  const month = eventDate
    .toLocaleString("default", { month: "short" })
    .toUpperCase();

  return (
    <Card className="event-card">
      <div className="event-img-container">
        <Card.Img
          variant="top"
          src={
            event.imageUrl && event.imageUrl.startsWith("http")
              ? event.imageUrl
              : event.imageUrl
              ? `https://info6150-finalproject.onrender.com/${event.imageUrl.replace(
                  /^\//,
                  ""
                )}`
              : placeholderImage
          }
          alt={title}
          className="event-img"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = placeholderImage;
          }}
        />

        <div className="event-img-overlay">
          {/* Updated horizontal date display */}
          <div className="event-date-horizontal">
            <span className="date-day">{day}</span>
            <span className="date-month">{month}</span>
          </div>

          {isFeatured && (
            <div className="featured-tag">
              <i className="bi bi-star-fill me-1"></i> Featured
            </div>
          )}
        </div>
      </div>

      <Card.Body className="position-relative">
        <div className="category-badge">
          <Badge bg="primary" pill>
            {category}
          </Badge>
        </div>

        <Card.Title className="event-title">{title}</Card.Title>

        <div className="event-details">
          <div className="detail-item">
            <i className="bi bi-clock me-2"></i>
            {startTime || "00:00"}
          </div>

          <div className="detail-item">
            <i className="bi bi-geo-alt me-2"></i>
            {location?.venue || "Online"}
            {location?.city && `, ${location.city}`}
          </div>
        </div>

        <div className="ticket-info">
          <div className="price">
            {ticketPrice > 0 ? formatCurrency(ticketPrice) : "FREE"}
          </div>

          <div className="availability">
            <Badge bg={availabilityVariant} pill className="availability-badge">
              {availabilityStatus}
            </Badge>
          </div>
        </div>

        {ticketsRemaining > 0 && (
          <div className="tickets-progress">
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${percentageSold}%` }}
                aria-valuenow={percentageSold}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <small className="tickets-text">
              {ticketsRemaining} tickets left
            </small>
          </div>
        )}
      </Card.Body>

      <div className="card-hover-content">
        <Link to={`/events/${_id}`} className="btn-view-details">
          View Details <i className="bi bi-arrow-right-circle ms-1"></i>
        </Link>
      </div>
    </Card>
  );
};

export default EventCard;
