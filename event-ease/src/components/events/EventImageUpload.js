// src/components/events/EventImageUpload.js
import React, { useState, useRef } from "react";
import { Form, Card, Button, Image, Spinner, Alert } from "react-bootstrap";
import { uploadEventImage } from "../../services/eventService";

const EventImageUpload = ({ eventId, currentImage, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Default image placeholder
  const defaultImage = "https://via.placeholder.com/600x400?text=Event+Image";

  // Get image URL
  const getImageUrl = () => {
    if (!currentImage) return defaultImage;

    // Check if it's already a full URL
    if (currentImage.startsWith("http")) {
      return currentImage;
    }

    // Otherwise, assume it's a relative path
    return `/uploads/events/${currentImage}`;
  };

  // Handle click on upload button
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPG, PNG, GIF)");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should not exceed 2MB");
      return;
    }

    // Upload image
    setLoading(true);
    setError("");

    try {
      await uploadEventImage(eventId, file);
      onSuccess("Event image uploaded successfully");
      setLoading(false);
    } catch (err) {
      console.error("Image upload error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to upload image";
      setError(errorMessage);
      if (onError) onError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h5 className="mb-0">Event Image</h5>
      </Card.Header>
      <Card.Body className="text-center">
        <div className="mb-3 position-relative">
          <Image
            src={getImageUrl()}
            alt="Event cover"
            className="img-fluid rounded"
            style={{ maxHeight: "300px", objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
            }}
          />

          {loading && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded">
              <Spinner animation="border" variant="light" />
            </div>
          )}
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group controlId="eventImage">
          <Form.Control
            type="file"
            ref={fileInputRef}
            className="d-none"
            accept="image/jpeg, image/png, image/gif"
            onChange={handleFileChange}
          />
          <Button
            variant="outline-primary"
            onClick={handleUploadClick}
            disabled={loading || !eventId}
          >
            {!eventId
              ? "Save event first to upload image"
              : currentImage
              ? "Change Image"
              : "Upload Image"}
          </Button>

          <Form.Text className="d-block text-muted mt-2">
            Recommended size: 1200 x 600 pixels. Maximum size: 2MB.
          </Form.Text>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default EventImageUpload;
