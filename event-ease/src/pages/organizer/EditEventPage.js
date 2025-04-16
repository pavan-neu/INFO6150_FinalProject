// src/pages/organizer/EditEventPage.js
import React, { useState, useEffect, useCallback } from "react";
import { Card, Alert, Button, Spinner, Modal } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import OrganizerLayout from "../../components/layout/OrganizerLayout";
import EventForm from "../../components/events/EventForm";
import EventImageUpload from "../../components/events/EventImageUpload";
import {
  getEventById,
  updateEvent,
  cancelEvent,
} from "../../services/eventService";
import { useToast } from "../../context/ToastContext";

const EditEventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingEvent, setCancellingEvent] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Validate eventId
  useEffect(() => {
    if (!eventId || eventId === "undefined") {
      setError("Invalid event ID. Please select a valid event.");
      setLoading(false);
    }
  }, [eventId]);

  // Fetch event details
  const fetchEventDetails = useCallback(async () => {
    // Skip API call if eventId is invalid
    if (!eventId || eventId === "undefined") {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const eventData = await getEventById(eventId);
      setEvent(eventData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching event:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to load event details";
      setError(errorMessage);
      setLoading(false);
    }
  }, [eventId]);

  // Load event on mount
  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setSaving(true);
    setError("");

    try {
      await updateEvent(eventId, formData);
      showToast("Event updated successfully", "success");

      // Refresh event details
      await fetchEventDetails();
      setSaving(false);
    } catch (err) {
      console.error("Event update error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update event";
      setError(errorMessage);
      setSaving(false);
    }
  };

  // Handle event cancellation
  const handleCancelEvent = async () => {
    setCancellingEvent(true);

    try {
      await cancelEvent(eventId);
      showToast("Event cancelled successfully", "success");
      setShowCancelModal(false);

      // Refresh event details
      await fetchEventDetails();
      setCancellingEvent(false);
    } catch (err) {
      console.error("Event cancellation error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to cancel event";
      setError(errorMessage);
      setShowCancelModal(false);
      setCancellingEvent(false);
    }
  };

  // Handle image upload success
  const handleImageUploadSuccess = (message) => {
    showToast(message, "success");
    fetchEventDetails(); // Refresh to get updated image
  };

  // Handle image upload error
  const handleImageUploadError = (message) => {
    setError(message);
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate("/organizer/events");
  };

  if (loading) {
    return (
      <OrganizerLayout>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading event details...</p>
        </div>
      </OrganizerLayout>
    );
  }

  if (error && !event) {
    return (
      <OrganizerLayout>
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            {eventId && eventId !== "undefined" ? (
              <Button
                variant="primary"
                onClick={fetchEventDetails}
                className="me-2"
              >
                Try Again
              </Button>
            ) : null}
            <Button variant="outline-secondary" onClick={handleBackClick}>
              Back to Events
            </Button>
          </div>
        </Alert>
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Edit Event</h2>
        <div>
          <Button
            variant="outline-secondary"
            as={Link}
            to={`/events/${eventId}`}
            className="me-2"
          >
            View Public Page
          </Button>

          {event?.status !== "cancelled" && (
            <Button
              variant="outline-danger"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Event
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {event?.status === "cancelled" && (
        <Alert variant="warning" className="mb-4">
          This event has been cancelled and is no longer visible to the public.
        </Alert>
      )}

      <div className="row mb-4">
        <div className="col-lg-8 mb-3 mb-lg-0">
          <Card className="shadow-sm">
            <Card.Body>
              <EventForm
                initialData={event}
                onSubmit={handleSubmit}
                loading={saving}
                buttonText="Update Event"
              />
            </Card.Body>
          </Card>
        </div>

        <div className="col-lg-4">
          <EventImageUpload
            eventId={eventId}
            currentImage={event?.imageUrl}
            onSuccess={handleImageUploadSuccess}
            onError={handleImageUploadError}
          />

          <Card className="shadow-sm mt-4">
            <Card.Header>
              <h5 className="mb-0">Event Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button
                  as={Link}
                  to={`/organizer/events/${eventId}/tickets`}
                  variant="outline-primary"
                >
                  <i className="bi bi-ticket-perforated me-2"></i> Manage
                  Tickets
                </Button>
                <Button
                  as={Link}
                  to={`/organizer/events/${eventId}/sales`}
                  variant="outline-success"
                >
                  <i className="bi bi-graph-up me-2"></i> View Sales
                </Button>
                {event?.status !== "cancelled" && (
                  <Button
                    variant="outline-danger"
                    onClick={() => setShowCancelModal(true)}
                  >
                    <i className="bi bi-x-circle me-2"></i> Cancel Event
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Cancel Event Modal */}
      <Modal
        show={showCancelModal}
        onHide={() => setShowCancelModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancel Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to cancel this event? This action will:</p>
          <ul>
            <li>Remove the event from public listings</li>
            <li>Prevent any new ticket sales</li>
            <li>Notify ticket holders about the cancellation</li>
          </ul>
          <p className="text-danger">
            <strong>Warning:</strong> This action cannot be undone!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            No, Keep Event
          </Button>
          <Button
            variant="danger"
            onClick={handleCancelEvent}
            disabled={cancellingEvent}
          >
            {cancellingEvent ? "Cancelling..." : "Yes, Cancel Event"}
          </Button>
        </Modal.Footer>
      </Modal>
    </OrganizerLayout>
  );
};

export default EditEventPage;
