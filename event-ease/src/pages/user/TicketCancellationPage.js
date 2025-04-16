// src/pages/user/TicketCancellationPage.js
import React, { useState, useEffect } from "react";
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getTicketById, cancelTicket } from "../../services/ticketService";
import { useToast } from "../../context/ToastContext";

const TicketCancellationPage = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Fetch ticket details
  useEffect(() => {
    const fetchTicketDetails = async () => {
      setLoading(true);
      try {
        const data = await getTicketById(ticketId);
        setTicket(data);

        // If the ticket is already cancelled or used, redirect to ticket detail
        if (data.status === "cancelled" || data.status === "used") {
          navigate(`/tickets/${ticketId}`);
          showToast(
            `This ticket cannot be cancelled as it is already ${data.status}`,
            "warning"
          );
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load ticket details. Please try again.");
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId, navigate, showToast]);

  // Handle ticket cancellation
  const handleCancelTicket = async () => {
    setCancelling(true);
    try {
      await cancelTicket(ticketId);
      showToast("Ticket cancelled successfully", "success");
      navigate("/tickets");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel ticket");
      setCancelling(false);
    }
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
        <Link to="/tickets" className="btn btn-primary">
          Back to Tickets
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Card className="shadow-sm">
            <Card.Header className="bg-danger text-white">
              <h4 className="mb-0">Cancel Ticket</h4>
            </Card.Header>
            <Card.Body className="text-center p-5">
              <i
                className="bi bi-exclamation-triangle text-danger"
                style={{ fontSize: "3rem" }}
              ></i>

              <h3 className="mt-3 mb-3">
                Are you sure you want to cancel this ticket?
              </h3>

              {ticket && (
                <div className="mb-4">
                  <h5>{ticket.event.title}</h5>
                  <p className="text-muted">
                    {new Date(ticket.event.startDate).toLocaleDateString()} at{" "}
                    {ticket.event.startTime}
                  </p>
                  <p className="text-muted">
                    Ticket Number: {ticket.ticketNumber}
                  </p>
                </div>
              )}

              <Alert variant="warning">
                <p className="mb-0">
                  <strong>Warning:</strong> This action cannot be undone. Refund
                  policies vary by event.
                </p>
              </Alert>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <Link
                  to={`/tickets/${ticketId}`}
                  className="btn btn-outline-secondary btn-lg"
                >
                  No, Keep Ticket
                </Link>
                <Button
                  variant="danger"
                  size="lg"
                  onClick={handleCancelTicket}
                  disabled={cancelling}
                >
                  {cancelling ? "Cancelling..." : "Yes, Cancel Ticket"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default TicketCancellationPage;
