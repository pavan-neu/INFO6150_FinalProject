// src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Table, Button, Spinner, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getEvents } from "../../services/eventService";
import { getUsers } from "../../services/adminService";
import AdminLayout from "../../components/layout/AdminLayout";
import axios from "axios";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalTickets: 0,
    totalRevenue: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  // In the useEffect of AdminDashboard.js

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch events and users data
        const eventsData = await getEvents({ limit: 5, page: 1 });

        // Make sure auth headers are set before fetching users
        // This ensures we have the token ready
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }

        // Add a small delay to ensure auth is processed
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Then fetch users
        const usersData = await getUsers({ limit: 5, page: 1 });

        // Check the structure of usersData and handle both array and object responses
        const usersArray = Array.isArray(usersData)
          ? usersData
          : usersData.users || [];

        // Set recent data
        setRecentEvents(eventsData.events || []);
        setRecentUsers(usersArray);

        // Set stats
        setStats({
          totalUsers: Array.isArray(usersData)
            ? usersData.length
            : usersData.total || usersArray.length,
          totalEvents: eventsData.total || 0,
          totalTickets: eventsData.events.reduce(
            (acc, event) => acc + (event.totalTickets - event.ticketsRemaining),
            0
          ),
          totalRevenue: eventsData.events.reduce(
            (acc, event) =>
              acc +
              (event.totalTickets - event.ticketsRemaining) * event.ticketPrice,
            0
          ),
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Still show the dashboard even if there's an error
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

  // Get role badge
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge bg="danger">Admin</Badge>;
      case "organizer":
        return <Badge bg="primary">Organizer</Badge>;
      case "user":
        return <Badge bg="info">User</Badge>;
      default:
        return <Badge bg="secondary">{role}</Badge>;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading dashboard data...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Stats cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="h-100 bg-primary bg-opacity-10">
            <Card.Body className="text-center">
              <i className="bi bi-people mb-2" style={{ fontSize: "2rem" }}></i>
              <h2>{stats.totalUsers}</h2>
              <h6 className="text-muted">Total Users</h6>
            </Card.Body>
            <Card.Footer className="bg-transparent border-0 text-center">
              <Button
                as={Link}
                to="/admin/users"
                variant="outline-primary"
                size="sm"
              >
                Manage Users
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 bg-success bg-opacity-10">
            <Card.Body className="text-center">
              <i
                className="bi bi-calendar-event mb-2"
                style={{ fontSize: "2rem" }}
              ></i>
              <h2>{stats.totalEvents}</h2>
              <h6 className="text-muted">Total Events</h6>
            </Card.Body>
            <Card.Footer className="bg-transparent border-0 text-center">
              <Button
                as={Link}
                to="/admin/events"
                variant="outline-success"
                size="sm"
              >
                Manage Events
              </Button>
            </Card.Footer>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 bg-info bg-opacity-10">
            <Card.Body className="text-center">
              <i
                className="bi bi-ticket-perforated mb-2"
                style={{ fontSize: "2rem" }}
              ></i>
              <h2>{stats.totalTickets}</h2>
              <h6 className="text-muted">Tickets Sold</h6>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 bg-warning bg-opacity-10">
            <Card.Body className="text-center">
              <i
                className="bi bi-cash-coin mb-2"
                style={{ fontSize: "2rem" }}
              ></i>
              <h2>${stats.totalRevenue.toFixed(2)}</h2>
              <h6 className="text-muted">Total Revenue</h6>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Recent events */}
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Events</h5>
              <Button as={Link} to="/admin/events" variant="primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.map((event) => (
                      <tr key={event._id}>
                        <td>
                          <div>
                            <p className="mb-0 fw-bold">{event.title}</p>
                            <small>{event.organizer.name}</small>
                          </div>
                        </td>
                        <td>{formatDate(event.startDate)}</td>
                        <td>{getStatusBadge(event.status)}</td>
                        <td>
                          <Button
                            as={Link}
                            to={`/admin/events/${event._id}`}
                            variant="outline-primary"
                            size="sm"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent users */}
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Users</h5>
              <Button as={Link} to="/admin/users" variant="primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="avatar me-2"
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: "#e9ecef",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1.2rem",
                              }}
                            >
                              {user.name[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="mb-0 fw-bold">{user.name}</p>
                              <small>{user.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>{getRoleBadge(user.role)}</td>
                        <td>
                          <Badge bg={user.active ? "success" : "danger"}>
                            {user.active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            as={Link}
                            to={`/admin/users/${user._id}`}
                            variant="outline-primary"
                            size="sm"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default AdminDashboard;