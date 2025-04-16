// src/pages/user/UserDashboard.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "axios";

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // User stats state
  const [userStats, setUserStats] = useState({
    upcomingEvents: 0,
    pastEvents: 0,
    totalSpent: 0,
  });

  // Upcoming events state
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Fetch user dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch user tickets
      const ticketsResponse = await axios.get("/tickets/my-tickets");

      // Fetch user transactions
      const transactionsResponse = await axios.get(
        "/transactions/my-transactions"
      );

      // Process tickets to separate upcoming and past events
      const currentDate = new Date();
      const tickets = ticketsResponse.data.tickets || [];

      // Filter for upcoming events (event date is in the future)
      const upcoming = tickets.filter(
        (ticket) =>
          new Date(ticket.event.startDate) > currentDate &&
          ticket.status !== "cancelled"
      );

      // Filter for past events (event date is in the past)
      const past = tickets.filter(
        (ticket) =>
          new Date(ticket.event.startDate) <= currentDate ||
          ticket.status === "used"
      );

      // Calculate total spent from transactions
      const transactions = transactionsResponse.data.transactions || [];
      const totalSpent = transactions.reduce(
        (sum, transaction) =>
          transaction.status === "completed" ? sum + transaction.amount : sum,
        0
      );

      // Set user stats
      setUserStats({
        upcomingEvents: upcoming.length,
        pastEvents: past.length,
        totalSpent: totalSpent,
      });

      // Set upcoming events list (for the section display)
      // Map to format needed for display
      const upcomingEventList = upcoming.map((ticket) => ({
        id: ticket.event._id,
        name: ticket.event.title,
        date: ticket.event.startDate,
        time: ticket.event.startTime,
        ticketId: ticket._id,
      }));

      setUpcomingEvents(upcomingEventList);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again later.");
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your dashboard...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
        <Button onClick={fetchDashboardData} variant="primary">
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">My Dashboard</h1>

      <Row className="mb-4">
        <Col lg={4} md={6} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i
                  className="bi bi-ticket-perforated text-primary"
                  style={{ fontSize: "2.5rem" }}
                ></i>
              </div>
              <h2>{userStats.upcomingEvents}</h2>
              <p className="mb-0">Upcoming Events</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i
                  className="bi bi-calendar-check text-success"
                  style={{ fontSize: "2.5rem" }}
                ></i>
              </div>
              <h2>{userStats.pastEvents}</h2>
              <p className="mb-0">Past Events</p>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={12} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i
                  className="bi bi-cash-coin text-danger"
                  style={{ fontSize: "2.5rem" }}
                ></i>
              </div>
              <h2>${userStats.totalSpent.toFixed(2)}</h2>
              <p className="mb-0">Total Spent</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={7} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Upcoming Events</h5>
              <Link to="/tickets" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </Card.Header>
            <Card.Body>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-4">
                  <i
                    className="bi bi-calendar-x text-muted"
                    style={{ fontSize: "2rem" }}
                  ></i>
                  <p className="mt-2 mb-0">
                    You don't have any upcoming events
                  </p>
                  <Link to="/events" className="btn btn-primary mt-3">
                    Browse Events
                  </Link>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {upcomingEvents.map((event) => (
                    <ListGroup.Item
                      key={event.id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h6 className="mb-1">{event.name}</h6>
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>
                          {new Date(event.date).toLocaleDateString()} at{" "}
                          {event.time}
                        </small>
                      </div>
                      <div>
                        <Link
                          to={`/events/${event.id}`}
                          className="btn btn-sm btn-outline-secondary me-2"
                        >
                          View Event
                        </Link>
                        <Link
                          to={`/tickets/${event.ticketId}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          View Ticket
                        </Link>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Quick Links</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button as={Link} to="/profile" variant="outline-primary">
                  <i className="bi bi-person-circle me-2"></i>
                  Manage Profile
                </Button>
                <Button as={Link} to="/tickets" variant="outline-secondary">
                  <i className="bi bi-ticket-perforated me-2"></i>
                  My Tickets
                </Button>
                <Button as={Link} to="/transactions" variant="outline-info">
                  <i className="bi bi-credit-card me-2"></i>
                  My Transactions
                </Button>
                <Button as={Link} to="/events" variant="outline-success">
                  <i className="bi bi-search me-2"></i>
                  Browse Events
                </Button>

                {(currentUser?.role === "organizer" ||
                  currentUser?.role === "admin") && (
                  <Button
                    as={Link}
                    to="/organizer/dashboard"
                    variant="outline-info"
                  >
                    <i className="bi bi-calendar-event me-2"></i>
                    Organizer Dashboard
                  </Button>
                )}

                {currentUser?.role === "admin" && (
                  <Button
                    as={Link}
                    to="/admin/dashboard"
                    variant="outline-danger"
                  >
                    <i className="bi bi-gear me-2"></i>
                    Admin Dashboard
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;
