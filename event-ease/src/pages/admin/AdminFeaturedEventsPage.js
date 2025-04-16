// src/pages/admin/AdminFeaturedEventsPage.js
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
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import Pagination from "../../components/ui/Pagination";
import { getEvents } from "../../services/eventService";
import { featureEvent } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

const AdminFeaturedEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [featureNote, setFeatureNote] = useState("");
  const { showToast } = useToast();

  // Fetch featured events
  const fetchFeaturedEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch all events first
      const data = await getEvents({ page, limit: 10 });
      
      // Filter for featured events only and apply search filter if needed
      let filteredEvents = data.events.filter(event => event.isFeatured);
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
          event.title.toLowerCase().includes(query) ||
          (event.organizer && event.organizer.name.toLowerCase().includes(query)) ||
          (event.location && event.location.city.toLowerCase().includes(query))
        );
      }

      setEvents(filteredEvents);
      setTotalPages(Math.ceil(filteredEvents.length / 10));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching featured events:", err);
      setError("Failed to load featured events. Please try again.");
      setLoading(false);
    }
  }, [page, searchQuery]);

  // Load events on mount and when dependencies change
  useEffect(() => {
    fetchFeaturedEvents();
  }, [fetchFeaturedEvents]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  // Show feature modal
  const handleShowFeatureModal = (event) => {
    setSelectedEvent(event);
    setFeatureNote(event.featureNote || "");
    setShowFeatureModal(true);
  };

  // Handle feature/unfeature event
  const handleFeatureToggle = async () => {
    if (!selectedEvent) return;

    try {
      await featureEvent(selectedEvent._id, !selectedEvent.isFeatured, featureNote);
      showToast(`Event ${selectedEvent.isFeatured ? "unfeatured" : "featured"} successfully`, "success");
      setShowFeatureModal(false);
      fetchFeaturedEvents(); // Refresh the events list
    } catch (err) {
      console.error("Error toggling feature status:", err);
      showToast(`Failed to ${selectedEvent.isFeatured ? "unfeature" : "feature"} event`, "danger");
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

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Featured Events</h2>
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
                  placeholder="Search featured events..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </div>
            <div className="col-md-6 text-md-end">
              <Link to="/admin/events" className="btn btn-primary">
                <i className="bi bi-arrow-left me-2"></i> Back to All Events
              </Link>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading featured events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-5">
              <i
                className="bi bi-star text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h4 className="mt-3">No Featured Events</h4>
              <p className="text-muted mb-3">
                {searchQuery 
                  ? "No featured events match your search criteria."
                  : "There are no featured events yet."}
              </p>
              <Link to="/admin/events" className="btn btn-primary">
                Browse All Events
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Organizer</th>
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
                              <Badge bg="warning" text="dark" className="ms-2">
                                Featured
                              </Badge>
                            </h6>
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
                        <Link to={`/admin/users/${event.organizer._id}`}>
                          {event.organizer.name}
                        </Link>
                      </td>
                      <td>
                        <Badge bg={event.status === "active" ? "success" : "danger"}>
                          {event.status}
                        </Badge>
                      </td>
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
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleShowFeatureModal(event)}
                          >
                            Unfeature
                          </Button>
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

      {/* Feature/Unfeature Modal */}
      <Modal show={showFeatureModal} onHide={() => setShowFeatureModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEvent?.isFeatured ? "Unfeature Event" : "Feature Event"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent?.isFeatured ? (
            <p>
              Are you sure you want to remove <strong>{selectedEvent?.title}</strong> from featured events?
              It will no longer appear in the featured section on the homepage.
            </p>
          ) : (
            <>
              <p>
                Featuring <strong>{selectedEvent?.title}</strong> will showcase it on the homepage in the featured events section.
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
          <Button variant="secondary" onClick={() => setShowFeatureModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={selectedEvent?.isFeatured ? "warning" : "success"}
            onClick={handleFeatureToggle}
          >
            {selectedEvent?.isFeatured ? "Unfeature Event" : "Feature Event"}
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default AdminFeaturedEventsPage;