// src/pages/organizer/CreateEventPage.js
import React, { useState } from "react";
import { Card, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import OrganizerLayout from "../../components/layout/OrganizerLayout";
import EventForm from "../../components/events/EventForm";
import { createEvent } from "../../services/eventService";
import { useToast } from "../../context/ToastContext";

const CreateEventPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [createdEventId, setCreatedEventId] = useState(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    // Ensure we have a default imageUrl
    const eventData = {
      ...formData,
      imageUrl: formData.imageUrl || "placeholder.jpg",
    };

    try {
      const response = await createEvent(eventData);

      // Validate that we got a valid event ID back
      const eventId = response.eventId || response._id;

      if (!eventId) {
        throw new Error("Event created but no ID was returned from the server");
      }

      setSuccess(true);
      setCreatedEventId(eventId);
      showToast("Event created successfully!", "success");

      // Navigate to the events list instead of directly to edit
      // This avoids navigation issues if there's a problem with the ID
      navigate("/organizer/events");

      setLoading(false);
    } catch (err) {
      console.error("Event creation error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create event. Please try again.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  // Handle navigation to edit event
  const handleEditEvent = () => {
    if (createdEventId) {
      navigate(`/organizer/events/${createdEventId}/edit`);
    } else {
      setError("Cannot edit event: No event ID available");
    }
  };

  return (
    <OrganizerLayout>
      <h2 className="mb-4">Create New Event</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {success ? (
        <Alert variant="success">
          Event created successfully!
          <div className="mt-3">
            <Button
              variant="primary"
              onClick={handleEditEvent}
              className="me-2"
            >
              Edit Event
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => {
                setSuccess(false);
                setCreatedEventId(null);
              }}
            >
              Create Another Event
            </Button>
          </div>
        </Alert>
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <EventForm
              onSubmit={handleSubmit}
              loading={loading}
              buttonText="Create Event"
            />
          </Card.Body>
        </Card>
      )}
    </OrganizerLayout>
  );
};

export default CreateEventPage;
