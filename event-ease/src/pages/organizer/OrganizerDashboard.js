// src/pages/organizer/OrganizerDashboard.js
import React, { useState, useEffect, useCallback } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { getOrganizerEvents } from "../../services/organizerService";
import OrganizerLayout from "../../components/layout/OrganizerLayout";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OrganizerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalTickets: 0,
    ticketsSold: 0,
    totalRevenue: 0,
  });

  // Fetch organizer data
  const fetchOrganizerData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Get organizer events
      const eventsData = await getOrganizerEvents(1, 5); // Get first 5 events
      setEvents(eventsData.events);

      // Calculate stats from events
      const totalEvents = eventsData.total;
      const activeEvents = eventsData.events.filter(
        (event) => event.status === "active"
      ).length;

      let totalTickets = 0;
      let ticketsSold = 0;
      let totalRevenue = 0;

      eventsData.events.forEach((event) => {
        totalTickets += event.totalTickets || 0;
        ticketsSold += event.totalTickets - event.ticketsRemaining || 0;
        totalRevenue +=
          (event.totalTickets - event.ticketsRemaining) * event.ticketPrice ||
          0;
      });

      setStats({
        totalEvents,
        activeEvents,
        totalTickets,
        ticketsSold,
        totalRevenue,
      });

      setLoading(false);
    } catch (err) {
      console.error("Error fetching organizer data:", err);
      setError("Failed to load dashboard data. Please try again.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizerData();
  }, [fetchOrganizerData]);

  // Prepare chart data
  const chartData = {
    labels: events.slice(0, 5).map((event) => event.title),
    datasets: [
      {
        label: "Tickets Sold",
        data: events
          .slice(0, 5)
          .map((event) => event.totalTickets - event.ticketsRemaining),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Tickets Remaining",
        data: events.slice(0, 5).map((event) => event.ticketsRemaining),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Event Ticket Sales",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  // Function to get status badge
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

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate ticket sale percentage
  const calculateSalePercentage = (event) => {
    if (!event.totalTickets) return 0;
    return Math.round(
      ((event.totalTickets - event.ticketsRemaining) / event.totalTickets) * 100
    );
  };

  return (
    <OrganizerLayout>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading dashboard data...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">
          {error}
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-3"
            onClick={fetchOrganizerData}
          >
            Try Again
          </Button>
        </Alert>
      ) : (
        <>
          <h2 className="mb-4">Dashboard Overview</h2>

          {/* Stats Cards */}
          <Row className="mb-4">
            <Col lg={4} md={6} className="mb-3">
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <i
                      className="bi bi-calendar-check text-primary"
                      style={{ fontSize: "2.5rem" }}
                    ></i>
                  </div>
                  <h2>{stats.activeEvents}</h2>
                  <p className="mb-0">Active Events</p>
                  <small className="text-muted">
                    Out of {stats.totalEvents} total events
                  </small>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={6} className="mb-3">
              <Card className="shadow-sm h-100">
                <Card.Body className="text-center">
                  <div className="mb-3">
                    <i
                      className="bi bi-ticket-perforated text-success"
                      style={{ fontSize: "2.5rem" }}
                    ></i>
                  </div>
                  <h2>{stats.ticketsSold}</h2>
                  <p className="mb-0">Tickets Sold</p>
                  <small className="text-muted">
                    Out of {stats.totalTickets} total tickets
                  </small>
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
                  <h2>${stats.totalRevenue.toFixed(2)}</h2>
                  <p className="mb-0">Total Revenue</p>
                  <small className="text-muted">From all ticket sales</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Chart */}
          <Row className="mb-4">
            <Col>
              <Card className="shadow-sm">
                <Card.Body>
                  {events.length > 0 ? (
                    <Bar data={chartData} options={chartOptions} />
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">
                        No event data available for chart visualization
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Events Table */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Events</h5>
              <Link
                to="/organizer/events"
                className="btn btn-sm btn-outline-primary"
              >
                View All
              </Link>
            </Card.Header>
            <Card.Body>
              {events.length === 0 ? (
                <div className="text-center py-4">
                  <i
                    className="bi bi-calendar-x text-muted"
                    style={{ fontSize: "3rem" }}
                  ></i>
                  <h5 className="mt-3">No Events Created Yet</h5>
                  <p className="text-muted mb-3">
                    Create your first event to get started!
                  </p>
                  <Link
                    to="/organizer/events/create"
                    className="btn btn-primary"
                  >
                    Create Event
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead>
                      <tr>
                        <th>Event</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Tickets Sold</th>
                        <th>Revenue</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="event-image me-2"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  backgroundImage: `url(${event.imageUrl})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  borderRadius: "4px",
                                }}
                              ></div>
                              <div>
                                <strong>{event.title}</strong>
                              </div>
                            </div>
                          </td>
                          <td>{formatDate(event.startDate)}</td>
                          <td>{getStatusBadge(event.status)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="w-100 me-2"
                                style={{ maxWidth: "100px" }}
                              >
                                <div
                                  className="progress"
                                  style={{ height: "6px" }}
                                >
                                  <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                      width: `${calculateSalePercentage(
                                        event
                                      )}%`,
                                    }}
                                    aria-valuenow={calculateSalePercentage(
                                      event
                                    )}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                              </div>
                              <span>
                                {event.totalTickets - event.ticketsRemaining}/
                                {event.totalTickets}
                              </span>
                            </div>
                          </td>
                          <td>
                            $
                            {(
                              (event.totalTickets - event.ticketsRemaining) *
                              event.ticketPrice
                            ).toFixed(2)}
                          </td>
                          <td>
                            <Link
                              to={`/events/${event._id}`}
                              className="btn btn-sm btn-outline-secondary"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col sm={6} md={4}>
                  <Link
                    to="/organizer/events/create"
                    className="btn btn-primary w-100"
                  >
                    <i className="bi bi-plus-circle me-2"></i> Create Event
                  </Link>
                </Col>
                <Col sm={6} md={4}>
                  <Link
                    to="/organizer/events"
                    className="btn btn-outline-secondary w-100"
                  >
                    <i className="bi bi-list-ul me-2"></i> Manage Events
                  </Link>
                </Col>
                <Col sm={6} md={4}>
                  <Link
                    to="/organizer/sales"
                    className="btn btn-outline-success w-100"
                  >
                    <i className="bi bi-graph-up me-2"></i> View Sales
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </>
      )}
    </OrganizerLayout>
  );
};

export default OrganizerDashboard;