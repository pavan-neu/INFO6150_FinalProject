// src/components/events/EventCard.js
import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatDate, formatCurrency } from "../../utils/formatters";
import "./EventCard.css";

const EventCard = ({ event }) => {
  const {
    _id,
    title,
    imageUrl,
    category,
    startDate,
    startTime,
    location,
    ticketPrice,
    ticketsRemaining,
    totalTickets,
    isFeatured,
  } = event;

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

  // Generate a color based on category (for category badge background)
  const getCategoryColor = (category) => {
    const categories = {
      conference: "primary",
      workshop: "info",
      concert: "danger",
      sports: "success",
      festival: "warning",
      networking: "secondary",
      seminar: "dark",
    };

    return categories[category?.toLowerCase()] || "primary";
  };

  return (
    <Card className="event-card">
      <div className="event-img-container">
        <Card.Img
          variant="top"
          src={imageUrl || "https://via.placeholder.com/300x200?text=EventEase"}
          alt={title}
          className="event-img"
        />

        <div className="event-img-overlay">
          <div className="event-date">
            <div className="event-date-day">
              {new Date(startDate).getDate()}
            </div>
            <div className="event-date-month">
              {new Date(startDate).toLocaleString("default", {
                month: "short",
              })}
            </div>
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
          <Badge bg={getCategoryColor(category)} pill>
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
            <Badge
              bg={availabilityVariant}
              pill
              className={`availability-badge ${availabilityVariant}`}
            >
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
