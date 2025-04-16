// src/pages/organizer/OrganizerEventsPage.js
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Form,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import OrganizerLayout from "../../components/layout/OrganizerLayout";
import Pagination from "../../components/ui/Pagination";
import {
  getOrganizerEvents,
  cancelEvent,
} from "../../services/organizerService";
import { useToast } from "../../context/ToastContext";

const OrganizerEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const { showToast } = useToast();

  // Fetch events list
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // You can add search and filter params here if your API supports them
      const data = await getOrganizerEvents(page, 10);

      let filteredEvents = data.events;

      // Client-side filtering by status
      if (filterStatus) {
        filteredEvents = filteredEvents.filter(
          (event) => event.status === filterStatus
        );
      }

      // Client-side search by title
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredEvents = filteredEvents.filter((event) =>
          event.title.toLowerCase().includes(query)
        );
      }

      setEvents(filteredEvents);
      setTotalPages(data.pages);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again.");
      setLoading(false);
    }
  }, [page, searchQuery, filterStatus]);

  // Load events on mount and when page, search or filter changes
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle event cancellation
  const handleCancelEvent = async (eventId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this event? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await cancelEvent(eventId);
      showToast("Event cancelled successfully", "success");
      fetchEvents();
    } catch (err) {
      console.error("Error cancelling event:", err);
      showToast("Failed to cancel event", "danger");
    }
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setPage(1); // Reset to first page when filtering
  };

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

  return (
    <OrganizerLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">My Events</h2>
        <Button as={Link} to="/organizer/events/create" variant="primary">
          <i className="bi bi-plus-circle me-2"></i> Create Event
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm mb-4">
        <Card.Header>
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </div>
            <div className="col-md-6">
              <Form.Select
                value={filterStatus}
                onChange={handleStatusFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading your events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-5">
              <i
                className="bi bi-calendar-x text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h4 className="mt-3">No Events Found</h4>
              <p className="text-muted mb-3">
                {searchQuery || filterStatus
                  ? "No events match your search or filter criteria."
                  : "You haven't created any events yet."}
              </p>
              <Button as={Link} to="/organizer/events/create" variant="primary">
                Create Your First Event
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Tickets</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="event-image me-3"
                            style={{
                              width: "60px",
                              height: "60px",
                              backgroundImage: `url(${event.imageUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              borderRadius: "4px",
                            }}
                          ></div>
                          <div>
                            <h6 className="mb-0">{event.title}</h6>
                            <span className="badge bg-secondary me-1">
                              {event.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {formatDate(event.startDate)}
                        <small className="d-block text-muted">
                          {event.startTime}
                        </small>
                      </td>
                      <td>
                        {event.location.venue}
                        <small className="d-block text-muted">
                          {event.location.city}
                        </small>
                      </td>
                      <td>
                        <div>
                          Sold: {event.totalTickets - event.ticketsRemaining}/
                          {event.totalTickets}
                        </div>
                        <div className="progress" style={{ height: "5px" }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${
                                ((event.totalTickets - event.ticketsRemaining) /
                                  event.totalTickets) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </td>
                      <td>{getStatusBadge(event.status)}</td>
                      <td>
                        <div className="btn-group">
                          <Button
                            as={Link}
                            to={`/organizer/events/${event._id}/edit`}
                            variant="outline-primary"
                            size="sm"
                          >
                            Edit
                          </Button>
                          <Button
                            as={Link}
                            to={`/events/${event._id}`}
                            variant="outline-secondary"
                            size="sm"
                          >
                            View
                          </Button>
                          <Button
                            as={Link}
                            to={`/organizer/events/${event._id}/tickets`}
                            variant="outline-info"
                            size="sm"
                          >
                            Tickets
                          </Button>
                          <Button
                            as={Link}
                            to={`/organizer/events/${event._id}/sales`}
                            variant="outline-success"
                            size="sm"
                          >
                            Sales
                          </Button>
                          {event.status === "active" && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleCancelEvent(event._id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </OrganizerLayout>
  );
};

export default OrganizerEventsPage;
