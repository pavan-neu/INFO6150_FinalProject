// src/pages/admin/AdminEventDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  Row,
  Col,
  Tab,
  Nav,
  ListGroup,
  Modal,
  Form,
} from "react-bootstrap";
import AdminLayout from "../../components/layout/AdminLayout";
import { getEventById, cancelEvent } from "../../services/eventService";
import { featureEvent } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

const AdminEventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [featureNote, setFeatureNote] = useState("");

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details. Please try again.");
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Feature/unfeature event
  const handleFeatureEvent = async () => {
    try {
      await featureEvent(eventId, !event.isFeatured, featureNote);
      showToast(
        `Event ${event.isFeatured ? "unfeatured" : "featured"} successfully`,
        "success"
      );

      // Refresh event data
      const updatedEvent = await getEventById(eventId);
      setEvent(updatedEvent);

      setShowFeatureModal(false);
      setFeatureNote("");
    } catch (err) {
      console.error("Error featuring event:", err);
      showToast(
        `Failed to ${event.isFeatured ? "unfeature" : "feature"} event`,
        "danger"
      );
    }
  };

  // Cancel event
  const handleCancelEvent = async () => {
    try {
      await cancelEvent(eventId);
      showToast("Event cancelled successfully", "success");

      // Refresh event data
      const updatedEvent = await getEventById(eventId);
      setEvent(updatedEvent);

      setShowCancelModal(false);
    } catch (err) {
      console.error("Error cancelling event:", err);
      showToast("Failed to cancel event", "danger");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (timeString) => {
    return timeString;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge bg="success">Active</Badge>;
      case "cancelled":
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading event details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </AdminLayout>
    );
  }

  if (!event) {
    return (
      <AdminLayout>
        <Alert variant="warning">
          Event not found or you don't have permission to view it.
        </Alert>
        <Button variant="primary" onClick={() => navigate("/admin/events")}>
          Return to Events
        </Button>
      </AdminLayout>
    );
  }

  // Construct the full image URL
  const imageUrl = event.imageUrl
    ? event.imageUrl.startsWith("http")
      ? event.imageUrl
      : `https://info6150-finalproject.onrender.com/${event.imageUrl}` // Adjust the base URL as needed
    : "/images/event-placeholder.png";

  return (
    <AdminLayout>
      {/* Header with breadcrumb navigation */}
      <div className="mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/admin/events">Events</Link>
            </li>
            <li className="breadcrumb-item active">{event.title}</li>
          </ol>
        </nav>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Event Details</h2>
          <div>
            <Button
              variant={event.isFeatured ? "outline-warning" : "outline-success"}
              className="me-2"
              onClick={() => setShowFeatureModal(true)}
            >
              {event.isFeatured ? "Unfeature" : "Feature"} Event
            </Button>
            {event.status === "active" && (
              <Button
                variant="outline-danger"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Event
              </Button>
            )}
          </div>
        </div>
      </div>

      <Row>
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Img
              variant="top"
              src={imageUrl}
              alt={event.title}
              style={{ height: "200px", objectFit: "cover" }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/event-placeholder.png";
              }}
            />
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">{event.title}</h4>
                {event.isFeatured && (
                  <Badge bg="warning" text="dark">
                    Featured
                  </Badge>
                )}
              </div>
              <p className="mb-0">
                {getStatusBadge(event.status)}
                <Badge bg="secondary" className="ms-2">
                  {event.category}
                </Badge>
              </p>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Event Information</h5>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col md={4} className="text-muted">
                    Start Date
                  </Col>
                  <Col md={8}>{formatDate(event.startDate)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={4} className="text-muted">
                    End Date
                  </Col>
                  <Col md={8}>{formatDate(event.endDate)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={4} className="text-muted">
                    Time
                  </Col>
                  <Col md={8}>
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={4} className="text-muted">
                    Location
                  </Col>
                  <Col md={8}>
                    {event.location.venue}, {event.location.city},{" "}
                    {event.location.state}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={4} className="text-muted">
                    Organizer
                  </Col>
                  <Col md={8}>
                    <Link to={`/admin/users/${event.organizer._id}`}>
                      {event.organizer.name}
                    </Link>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={4} className="text-muted">
                    Tickets
                  </Col>
                  <Col md={8}>
                    <div>
                      Sold: {event.totalTickets - event.ticketsRemaining}/
                      {event.totalTickets}
                    </div>
                    <div className="progress mt-1" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-primary"
                        style={{
                          width: `${
                            ((event.totalTickets - event.ticketsRemaining) /
                              event.totalTickets) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={4} className="text-muted">
                    Price
                  </Col>
                  <Col md={8}>${event.ticketPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={4} className="text-muted">
                    Created
                  </Col>
                  <Col md={8}>{formatDate(event.createdAt)}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col lg={8}>
          <Tab.Container defaultActiveKey="details">
            <Card className="mb-4">
              <Card.Header>
                <Nav variant="tabs">
                  <Nav.Item>
                    <Nav.Link eventKey="details">Event Details</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tickets">Tickets</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="transactions">Transactions</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="details">
                    <div className="mb-4">
                      <h5>Description</h5>
                      <div className="p-3 bg-light rounded">
                        {event.description ? (
                          event.description
                            .split("\n")
                            .map((paragraph, index) => (
                              <p key={index}>{paragraph}</p>
                            ))
                        ) : (
                          <p className="text-muted">No description provided.</p>
                        )}
                      </div>
                    </div>

                    {event.tags && event.tags.length > 0 && (
                      <div className="mb-4">
                        <h5>Tags</h5>
                        <div>
                          {event.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              bg="secondary"
                              className="me-1 mb-1"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h5>Address</h5>
                      <p className="mb-1">{event.location.venue}</p>
                      <p className="mb-1">{event.location.address}</p>
                      <p className="mb-0">
                        {event.location.city}, {event.location.state}{" "}
                        {event.location.zipCode}
                      </p>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="tickets">
                    <div className="text-center py-4">
                      <p className="mb-3">
                        View and manage all tickets for this event.
                      </p>
                      <Button
                        as={Link}
                        to={`/admin/events/${event._id}/tickets`}
                        variant="primary"
                      >
                        View All Tickets
                      </Button>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="transactions">
                    <div className="text-center py-4">
                      <p className="mb-3">
                        View all financial transactions for this event.
                      </p>
                      <Button
                        as={Link}
                        to={`/admin/events/${event._id}/transactions`}
                        variant="primary"
                      >
                        View All Transactions
                      </Button>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>

      {/* Cancel Event Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">Are you sure you want to cancel this event?</p>
          <div className="alert alert-warning">
            <strong>Note:</strong> This will cancel all pending tickets and
            notify all attendees. This action cannot be undone.
          </div>
          <div className="mb-3">
            <strong>Event:</strong> {event.title}
          </div>
          <div className="mb-3">
            <strong>Date:</strong> {formatDate(event.startDate)}
          </div>
          <div className="mb-0">
            <strong>Organizer:</strong> {event.organizer.name}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleCancelEvent}>
            Cancel Event
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Feature Event Modal */}
      <Modal show={showFeatureModal} onHide={() => setShowFeatureModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {event.isFeatured ? "Unfeature Event" : "Feature Event"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {event.isFeatured ? (
            <p>
              Are you sure you want to remove this event from featured events?
              It will no longer appear in the featured section on the homepage.
            </p>
          ) : (
            <>
              <p>
                Featuring this event will showcase it on the homepage in the
                featured events section.
              </p>
              <Form.Group className="mb-3">
                <Form.Label>Feature Note (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={featureNote}
                  onChange={(e) => setFeatureNote(e.target.value)}
                  placeholder="Add a note about why this event is being featured (internal use only)"
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowFeatureModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant={event.isFeatured ? "warning" : "success"}
            onClick={handleFeatureEvent}
          >
            {event.isFeatured ? "Unfeature Event" : "Feature Event"}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default AdminEventDetailPage;
