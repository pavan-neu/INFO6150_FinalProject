// src/pages/organizer/TicketDetailPage.js
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
  ListGroup,
} from "react-bootstrap";
import QRCode from "qrcode.react"; // You'll need to install this package
import OrganizerLayout from "../../components/layout/OrganizerLayout";
import { getTicketById, markTicketAsUsed } from "../../services/ticketService";
import { useToast } from "../../context/ToastContext";

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      try {
        const data = await getTicketById(ticketId);
        setTicket(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError("Failed to load ticket details. Please try again.");
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleMarkAsUsed = async () => {
    try {
      await markTicketAsUsed(ticketId);
      showToast("Ticket marked as used successfully", "success");
      // Refresh the ticket data
      const updatedTicket = await getTicketById(ticketId);
      setTicket(updatedTicket);
    } catch (err) {
      console.error("Error marking ticket as used:", err);
      showToast("Failed to mark ticket as used", "danger");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
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
      case "reserved":
        return <Badge bg="warning">Reserved</Badge>;
      case "paid":
        return <Badge bg="success">Paid</Badge>;
      case "used":
        return <Badge bg="info">Used</Badge>;
      case "cancelled":
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <OrganizerLayout>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading ticket details...</p>
        </div>
      </OrganizerLayout>
    );
  }

  if (error) {
    return (
      <OrganizerLayout>
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </OrganizerLayout>
    );
  }

  if (!ticket) {
    return (
      <OrganizerLayout>
        <Alert variant="warning">
          Ticket not found or you don't have permission to view it.
        </Alert>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      {/* Header with breadcrumb navigation */}
      <div className="mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/organizer/events">My Events</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/organizer/events/${ticket.event._id}/tickets`}>
                {ticket.event.title}
              </Link>
            </li>
            <li className="breadcrumb-item active">Ticket Details</li>
          </ol>
        </nav>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Ticket Details</h2>
          <div>
            {ticket.status === "paid" && (
              <Button variant="success" onClick={handleMarkAsUsed}>
                <i className="bi bi-check-circle me-2"></i> Mark as Used
              </Button>
            )}
          </div>
        </div>
      </div>

      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div className="mb-3">
                <QRCode value={ticket.ticketNumber} size={200} />
              </div>
              <h5>{ticket.ticketNumber}</h5>
              <div className="mb-2">{getStatusBadge(ticket.status)}</div>
              <p className="text-muted mb-0">
                Purchased on {formatDate(ticket.purchaseDate)}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Event Information</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <h4>{ticket.event.title}</h4>
                  <p className="mb-0">
                    <i className="bi bi-calendar3 me-2"></i>
                    {formatDate(ticket.event.startDate)}
                  </p>
                  <p className="mb-0">
                    <i className="bi bi-clock me-2"></i>
                    {formatTime(ticket.event.startTime)}
                  </p>
                  <p className="mb-0">
                    <i className="bi bi-geo-alt me-2"></i>
                    {ticket.event.location.venue}, {ticket.event.location.city}
                  </p>
                </Col>
                <Col md={4} className="text-end">
                  <h5>${ticket.price.toFixed(2)}</h5>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Attendee Information</h5>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col md={4} className="text-muted">
                    Name
                  </Col>
                  <Col md={8}>{ticket.user ? ticket.user.name : "Unknown"}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={4} className="text-muted">
                    Email
                  </Col>
                  <Col md={8}>
                    {ticket.user ? ticket.user.email : "Unknown"}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={4} className="text-muted">
                    Username
                  </Col>
                  <Col md={8}>
                    {ticket.user ? ticket.user.username : "Unknown"}
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>

          {ticket.status === "used" && (
            <Card className="mb-4 bg-light">
              <Card.Body>
                <h5 className="text-success">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Check-in Complete
                </h5>
                <p className="text-muted mb-0">
                  This ticket was checked in on {formatDate(ticket.usedDate)} at{" "}
                  {formatTime(ticket.usedTime)}
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </OrganizerLayout>
  );
};

export default TicketDetailPage;
