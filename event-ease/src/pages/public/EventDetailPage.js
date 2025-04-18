import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Badge, Button, Card } from "react-bootstrap";
import { getEventById } from "../../services/eventService";
import { bookTickets } from "../../services/ticketService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import AlertMessage from "../../components/ui/AlertMessage";
import useAuth from "../../hooks/useAuth";
import "./EventDetailPage.css";

// New TicketSelector component - we'll include it inline to keep things simple
const TicketSelector = ({ event, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(event.ticketPrice);

  useEffect(() => {
    setTotalPrice(event.ticketPrice * quantity);
    onQuantityChange(quantity, totalPrice);
  }, [quantity, event.ticketPrice, onQuantityChange]);

  const incrementQuantity = () => {
    if (quantity < event.ticketsRemaining) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="ticket-selector mb-4">
      <h5 className="mb-3">Select Tickets</h5>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span>Price per ticket:</span>
        <span className="fw-bold">${event.ticketPrice.toFixed(2)}</span>
      </div>

      <div className="quantity-selector d-flex align-items-center mb-3">
        <span>Quantity:</span>
        <div className="d-flex align-items-center ms-auto">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="rounded-circle"
            style={{ width: "32px", height: "32px", padding: 0 }}
          >
            -
          </Button>
          <span className="mx-3">{quantity}</span>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={incrementQuantity}
            disabled={quantity >= event.ticketsRemaining}
            className="rounded-circle"
            style={{ width: "32px", height: "32px", padding: 0 }}
          >
            +
          </Button>
        </div>
      </div>

      <div className="total-price d-flex justify-content-between align-items-center mb-3">
        <span>Total:</span>
        <span className="fw-bold fs-5">${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventById(id);
        setEvent(data);
        setTotalPrice(data.ticketPrice); // Initialize total price
        setLoading(false);
      } catch (err) {
        setError("Failed to load event details. Please try again later.");
        setLoading(false);
        console.error("Error fetching event details:", err);
      }
    };

    fetchEvent();
  }, [id]);

  const handleQuantityChange = (quantity, price) => {
    setTicketQuantity(quantity);
    setTotalPrice(price);
  };

  const handleBookTickets = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/events/${id}`);
      return;
    }

    setBookingInProgress(true);
    try {
      const result = await bookTickets(id, ticketQuantity);
      // Navigate to checkout page with the booking details
      navigate("/checkout", {
        state: {
          tickets: result.tickets,
          event: event,
          totalPrice: result.totalPrice,
          quantity: ticketQuantity,
        },
      });
    } catch (err) {
      setError("Failed to book tickets. Please try again.");
      console.error(err);
    } finally {
      setBookingInProgress(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <AlertMessage variant="danger">{error}</AlertMessage>;
  if (!event)
    return <AlertMessage variant="warning">Event not found</AlertMessage>;

  // Format dates
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if event is in the past
  const isEventPast = new Date(event.endDate) < new Date();

  return (
    <Container className="py-5">
      <Link to="/events" className="btn btn-outline-secondary mb-4">
        ← Back to Events
      </Link>

      {event.status === "cancelled" && (
        <AlertMessage variant="danger" className="mb-4">
          This event has been cancelled
        </AlertMessage>
      )}

      {isEventPast && (
        <AlertMessage variant="warning" className="mb-4">
          This event has already taken place
        </AlertMessage>
      )}

      <Row>
        <Col lg={8}>
          <div className="mb-4">
            <Badge bg="secondary" className="me-2">
              {event.category}
            </Badge>
            {event.isFeatured && (
              <Badge bg="warning" text="dark">
                Featured
              </Badge>
            )}
          </div>
          <h1 className="mb-3">{event.title}</h1>

          <div className="mb-4">
            <div
              className="event-image-container mb-4"
              style={{ height: "400px", overflow: "hidden" }}
            >
              <img
                src={
                  event.imageUrl && event.imageUrl.startsWith("http")
                    ? event.imageUrl
                    : event.imageUrl
                    ? `https://info6150-finalproject.onrender.com/${event.imageUrl.replace(
                        /^\//,
                        ""
                      )}`
                    : "/images/event-placeholder.png"
                }
                alt={event.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/event-placeholder.png";
                }}
                className="img-fluid w-100 h-100 object-fit-cover"
              />
            </div>

            <h3>About This Event</h3>
            <p className="my-3" style={{ whiteSpace: "pre-line" }}>
              {event.description}
            </p>

            {event.tags && event.tags.length > 0 && (
              <div className="mt-3">
                {event.tags.map((tag, index) => (
                  <Badge
                    bg="light"
                    text="dark"
                    className="me-2 mb-2"
                    key={index}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Col>

        <Col lg={4}>
          <Card className="sticky-top mb-4" style={{ top: "20px" }}>
            <Card.Body>
              <h5 className="mb-3">Event Details</h5>

              <div className="mb-3">
                <strong>Date:</strong>
                <br />
                {formatDate(event.startDate)}
                {event.startDate !== event.endDate && (
                  <> - {formatDate(event.endDate)}</>
                )}
              </div>

              <div className="mb-3">
                <strong>Time:</strong>
                <br />
                {event.startTime} - {event.endTime}
              </div>

              <div className="mb-3">
                <strong>Location:</strong>
                <br />
                {event.location.venue}
                <br />
                {event.location.address}
                <br />
                {event.location.city}, {event.location.state}{" "}
                {event.location.zipCode}
              </div>

              <div className="mb-3">
                <strong>Organizer:</strong>
                <br />
                {event.organizer?.name || "Unknown"}
              </div>

              {/* Replace the static price display with the ticket selector */}
              {event.status === "active" &&
              !isEventPast &&
              event.ticketsRemaining > 0 ? (
                <>
                  <TicketSelector
                    event={event}
                    onQuantityChange={handleQuantityChange}
                  />

                  {isAuthenticated ? (
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={handleBookTickets}
                      disabled={bookingInProgress}
                    >
                      {bookingInProgress ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Processing...
                        </>
                      ) : (
                        "Book Tickets"
                      )}
                    </Button>
                  ) : (
                    <Link
                      to={`/login?redirect=/events/${event._id}`}
                      className="btn btn-primary w-100"
                    >
                      Login to Book Tickets
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <strong>Price:</strong>
                    <br />
                    {event.ticketPrice === 0
                      ? "Free"
                      : `$${event.ticketPrice.toFixed(2)}`}
                  </div>

                  <div className="mb-3">
                    <strong>Availability:</strong>
                    <br />
                    {event.ticketsRemaining} / {event.totalTickets} tickets
                    available
                  </div>

                  <Button variant="secondary" className="w-100" disabled>
                    {event.status === "cancelled"
                      ? "Event Cancelled"
                      : isEventPast
                      ? "Event Ended"
                      : "Sold Out"}
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EventDetailPage;
