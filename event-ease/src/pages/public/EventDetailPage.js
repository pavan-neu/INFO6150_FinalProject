import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Badge, Button, Card } from "react-bootstrap";
import { getEventById } from "../../services/eventService";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import AlertMessage from "../../components/ui/AlertMessage";
import useAuth from "../../hooks/useAuth";

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventById(id);
        setEvent(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load event details. Please try again later.");
        setLoading(false);
        console.error("Error fetching event details:", err);
      }
    };

    fetchEvent();
  }, [id]);

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
                  event.imageUrl.startsWith("http")
                    ? event.imageUrl
                    : `/uploads/events/${event.imageUrl}`
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

              {event.status === "active" &&
              !isEventPast &&
              event.ticketsRemaining > 0 ? (
                isAuthenticated ? (
                  <Link
                    to={`/tickets/book/${event._id}`}
                    className="btn btn-primary w-100"
                  >
                    Book Tickets
                  </Link>
                ) : (
                  <Link
                    to={`/login?redirect=/events/${event._id}`}
                    className="btn btn-primary w-100"
                  >
                    Login to Book Tickets
                  </Link>
                )
              ) : (
                <Button variant="secondary" className="w-100" disabled>
                  {event.status === "cancelled"
                    ? "Event Cancelled"
                    : isEventPast
                    ? "Event Ended"
                    : "Sold Out"}
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EventDetailPage;
