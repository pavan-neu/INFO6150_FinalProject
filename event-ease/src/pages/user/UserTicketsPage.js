// src/pages/user/UserTicketsPage.js
import React, { useState, useEffect } from "react";
import { Container, Card, Table, Badge, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getUserTickets } from "../../services/ticketService";
import Pagination from "../../components/ui/Pagination";

const UserTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch tickets
  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUserTickets(page, 10);
      setTickets(data.tickets);
      setTotalPages(data.pages);
      setLoading(false);
    } catch (err) {
      setError("Failed to load tickets. Please try again.");
      setLoading(false);
    }
  };

  // Load tickets on component mount and when page changes
  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
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
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">My Tickets</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading your tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-5">
              <i
                className="bi bi-ticket-perforated text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h4 className="mt-3">No Tickets Found</h4>
              <p className="text-muted">
                You haven't purchased any tickets yet.
              </p>
              <Link to="/events" className="btn btn-primary mt-2">
                Browse Events
              </Link>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date & Time</th>
                      <th>Ticket Number</th>
                      <th>Status</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="ticket-event-image me-3"
                              style={{
                                width: "50px",
                                height: "50px",
                                backgroundImage: `url(${ticket.event.imageUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                borderRadius: "4px",
                              }}
                            ></div>
                            <div>
                              <p className="mb-0 fw-bold">
                                {ticket.event.title}
                              </p>
                              <small className="text-muted">
                                {ticket.event.location.venue}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          {formatDate(ticket.event.startDate)}
                          <br />
                          <small className="text-muted">
                            {ticket.event.startTime}
                          </small>
                        </td>
                        <td>
                          <small className="text-monospace">
                            {ticket.ticketNumber}
                          </small>
                        </td>
                        <td>{getStatusBadge(ticket.status)}</td>
                        <td>${ticket.price.toFixed(2)}</td>
                        <td>
                          <Link
                            to={`/tickets/${ticket._id}`}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            View
                          </Link>

                          {ticket.status !== "cancelled" &&
                            ticket.status !== "used" && (
                              <Link
                                to={`/tickets/${ticket._id}/cancel`}
                                className="btn btn-sm btn-outline-danger"
                              >
                                Cancel
                              </Link>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserTicketsPage;
