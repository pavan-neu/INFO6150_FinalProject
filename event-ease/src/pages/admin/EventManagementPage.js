// src/pages/admin/EventManagementPage.js
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
import AdminLayout from "../../components/layout/AdminLayout";
import Pagination from "../../components/ui/Pagination";
import { getEvents, cancelEvent } from "../../services/eventService";
import { featureEvent } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

const EventManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");
  const [filterDateRange, setFilterDateRange] = useState("");
  const { showToast } = useToast();

  // Fetch events list
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Apply filters if available
      const params = {
        page,
        limit: 10,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (filterCategory) {
        params.category = filterCategory;
      }

      const data = await getEvents(params);
      let filteredEvents = data.events || [];

      // Client-side filtering for featured status
      if (filterFeatured === "featured") {
        filteredEvents = filteredEvents.filter((event) => event.isFeatured);
      } else if (filterFeatured === "not-featured") {
        filteredEvents = filteredEvents.filter((event) => !event.isFeatured);
      }

      // Client-side filtering for date range
      if (filterDateRange) {
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );

        switch (filterDateRange) {
          case "upcoming":
            filteredEvents = filteredEvents.filter(
              (event) => new Date(event.startDate) >= today
            );
            break;
          case "past":
            filteredEvents = filteredEvents.filter(
              (event) => new Date(event.startDate) < today
            );
            break;
          case "this-week":
            const weekEnd = new Date(today);
            weekEnd.setDate(today.getDate() + 7);
            filteredEvents = filteredEvents.filter((event) => {
              const eventDate = new Date(event.startDate);
              return eventDate >= today && eventDate <= weekEnd;
            });
            break;
          case "this-month":
            const monthEnd = new Date(
              today.getFullYear(),
              today.getMonth() + 1,
              0
            );
            filteredEvents = filteredEvents.filter((event) => {
              const eventDate = new Date(event.startDate);
              return eventDate >= today && eventDate <= monthEnd;
            });
            break;
          default:
            break;
        }
      }

      setEvents(filteredEvents);
      setTotalPages(Math.ceil(filteredEvents.length / 10) || 1);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again.");
      setLoading(false);
    }
  }, [page, searchQuery, filterCategory, filterFeatured, filterDateRange]);

  // Load events on mount and when dependencies change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  // Handle category filter change
  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value);
    setPage(1); // Reset to first page when filtering
  };

  // Handle featured filter change
  const handleFeaturedFilterChange = (e) => {
    setFilterFeatured(e.target.value);
    setPage(1); // Reset to first page when filtering
  };

  // Handle date range filter change
  const handleDateRangeFilterChange = (e) => {
    setFilterDateRange(e.target.value);
    setPage(1); // Reset to first page when filtering
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

  // Handle featuring an event
  const handleFeatureEvent = async (eventId, isFeatured) => {
    try {
      await featureEvent(eventId, !isFeatured);
      showToast(
        `Event ${isFeatured ? "unfeatured" : "featured"} successfully`,
        "success"
      );
      fetchEvents();
    } catch (err) {
      console.error("Error featuring event:", err);
      showToast(
        `Failed to ${isFeatured ? "unfeature" : "feature"} event`,
        "danger"
      );
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
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Event Management</h2>
        <div>
          <Button
            as={Link}
            to="/admin/events/featured"
            variant="outline-warning"
            className="me-2"
          >
            <i className="bi bi-star me-1"></i> Featured Events
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm mb-4">
        <Card.Header>
          <div className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search events by title, organizer, or location..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </InputGroup>
          </div>

          <div className="row g-3">
            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={filterCategory}
                  onChange={handleCategoryFilterChange}
                >
                  <option value="">All Categories</option>
                  <option value="conference">Conference</option>
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="concert">Concert</option>
                  <option value="exhibition">Exhibition</option>
                  <option value="sport">Sport</option>
                  <option value="party">Party</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Featured</Form.Label>
                <Form.Select
                  value={filterFeatured}
                  onChange={handleFeaturedFilterChange}
                >
                  <option value="">All Events</option>
                  <option value="featured">Featured Only</option>
                  <option value="not-featured">Not Featured</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Date Range</Form.Label>
                <Form.Select
                  value={filterDateRange}
                  onChange={handleDateRangeFilterChange}
                >
                  <option value="">All Dates</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past Events</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-5">
              <i
                className="bi bi-calendar-x text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h4 className="mt-3">No Events Found</h4>
              <p className="text-muted mb-3">
                {searchQuery ||
                filterCategory ||
                filterFeatured ||
                filterDateRange
                  ? "No events match your search or filter criteria."
                  : "There are no events in the system yet."}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Organizer</th>
                    <th>Date</th>
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
                            <h6 className="mb-0">
                              {event.title}
                              {event.isFeatured && (
                                <Badge
                                  bg="warning"
                                  text="dark"
                                  className="ms-2"
                                >
                                  Featured
                                </Badge>
                              )}
                            </h6>
                            <span className="badge bg-secondary me-1">
                              {event.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Link
                          to={`/admin/users/${event.organizer._id}`}
                          className="text-decoration-none"
                        >
                          {event.organizer.name}
                        </Link>
                      </td>
                      <td>
                        {formatDate(event.startDate)}
                        <small className="d-block text-muted">
                          {event.startTime}
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
                            to={`/admin/events/${event._id}`}
                            variant="outline-primary"
                            size="sm"
                          >
                            View
                          </Button>
                          <Button
                            variant={
                              event.isFeatured
                                ? "outline-warning"
                                : "outline-success"
                            }
                            size="sm"
                            onClick={() =>
                              handleFeatureEvent(event._id, event.isFeatured)
                            }
                          >
                            {event.isFeatured ? "Unfeature" : "Feature"}
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
    </AdminLayout>
  );
};

export default EventManagementPage;