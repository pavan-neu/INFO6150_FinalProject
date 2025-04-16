// src/pages/user/TicketDetailPage.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getTicketById, cancelTicket } from "../../services/ticketService";
import { useToast } from "../../context/ToastContext";
import { QRCodeSVG } from "qrcode.react";

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const { showToast } = useToast();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  // Fetch ticket details
  const fetchTicketDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTicketById(ticketId);
      setTicket(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load ticket details. Please try again.");
      setLoading(false);
    }
  };

  // Load ticket on component mount
  useEffect(() => {
    fetchTicketDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  // Handle ticket cancellation
  const handleCancelTicket = async () => {
    setCancelling(true);
    try {
      await cancelTicket(ticketId);
      showToast("Ticket cancelled successfully", "success");
      // Refresh ticket data to show updated status
      await fetchTicketDetails();
      setShowCancelModal(false);
      setCancelling(false);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to cancel ticket",
        "danger"
      );
      setCancelling(false);
      setShowCancelModal(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "reserved":
        return (
          <Badge bg="warning" text="dark">
            Reserved
          </Badge>
        );
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

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading ticket details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={fetchTicketDetails} variant="primary">
          Try Again
        </Button>
      </Container>
    );
  }

  if (!ticket) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Ticket not found</Alert>
        <Link to="/tickets" className="btn btn-primary">
          Back to Tickets
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Link to="/tickets" className="btn btn-outline-secondary mb-4">
        ← Back to My Tickets
      </Link>

      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Ticket Details</h4>
            {getStatusBadge(ticket.status)}
          </div>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <h2 className="mb-3">{ticket.event.title}</h2>

              <div className="mb-4">
                <h5 className="text-muted mb-2">Event Details</h5>
                <p className="mb-1">
                  <i className="bi bi-calendar me-2"></i>
                  {formatDate(ticket.event.startDate)}
                </p>
                <p className="mb-1">
                  <i className="bi bi-clock me-2"></i>
                  {ticket.event.startTime} - {ticket.event.endTime}
                </p>
                <p className="mb-1">
                  <i className="bi bi-geo-alt me-2"></i>
                  {ticket.event.location.venue}, {ticket.event.location.address}
                  , {ticket.event.location.city}, {ticket.event.location.state}{" "}
                  {ticket.event.location.zipCode}
                </p>
              </div>

              <div className="mb-4">
                <h5 className="text-muted mb-2">Ticket Information</h5>
                <p className="mb-1">
                  <strong>Ticket Number:</strong> {ticket.ticketNumber}
                </p>
                <p className="mb-1">
                  <strong>Purchase Date:</strong>{" "}
                  {formatDate(ticket.purchaseDate)}
                </p>
                <p className="mb-1">
                  <strong>Price:</strong> ${ticket.price.toFixed(2)}
                </p>
              </div>

              {ticket.status !== "cancelled" && ticket.status !== "used" && (
                <Button
                  variant="danger"
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel Ticket
                </Button>
              )}

              {ticket.status === "cancelled" && (
                <Alert variant="danger">
                  This ticket has been cancelled and is no longer valid.
                </Alert>
              )}

              {ticket.status === "used" && (
                <Alert variant="info">
                  This ticket has been used and is no longer valid.
                </Alert>
              )}
            </Col>

            <Col md={4} className="text-center">
              <Card className="mb-3">
                <Card.Body>
                  <h5 className="card-title">Scan to Verify</h5>
                  <div className="mb-3 mt-3">
                    <QRCodeSVG
                      value={`${window.location.origin}/tickets/verify/${ticket._id}`}
                      size={150}
                      className="mx-auto d-block"
                    />
                  </div>
                  <p className="card-text small text-muted">
                    Present this QR code at the venue for entry
                  </p>
                </Card.Body>
              </Card>

              <Link
                to={`/events/${ticket.event._id}`}
                className="btn btn-outline-primary d-block"
              >
                View Event
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Cancel Confirmation Modal */}
      <Modal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to cancel this ticket? This action cannot be
            undone.
          </p>
          <p className="text-danger">
            <strong>Note:</strong> Refund policies vary by event. Please check
            the event details for the refund policy.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No, Keep Ticket
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelTicket}
            disabled={cancelling}
          >
            {cancelling ? "Cancelling..." : "Yes, Cancel Ticket"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TicketDetailPage;
