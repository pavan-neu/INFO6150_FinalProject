// src/components/events/EventForm.js
import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const EventForm = ({
  initialData,
  onSubmit,
  buttonText = "Create Event",
  loading = false,
}) => {
  const categories = [
    "concert",
    "conference",
    "exhibition",
    "workshop",
    "sports",
    "festival",
    "other",
  ];

  // Default form state for new events
  const defaultFormState = {
    title: "",
    description: "",
    category: "",
    imageUrl: "placeholder.jpg", // Add a default image URL
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    location: {
      venue: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
    totalTickets: 0,
    ticketPrice: 0,
    tags: [],
  };

  const [formData, setFormData] = useState(initialData || defaultFormState);
  const [errors, setErrors] = useState({});
  const [tagsInput, setTagsInput] = useState("");

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);

      // Convert tags array to comma-separated string for input field
      if (initialData.tags && initialData.tags.length > 0) {
        setTagsInput(initialData.tags.join(", "));
      }
    }
  }, [initialData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested location fields
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle numeric inputs
  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? "" : Number(value);

    setFormData({
      ...formData,
      [name]: numericValue,
    });
  };

  // Handle tags input
  const handleTagsChange = (e) => {
    setTagsInput(e.target.value);

    // Convert comma-separated string to array
    const tagsArray = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    setFormData({
      ...formData,
      tags: tagsArray,
    });
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Required fields
    if (!formData.title?.trim()) newErrors.title = "Title is required";
    if (!formData.description?.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";

    // Location validation
    if (!formData.location.venue?.trim())
      newErrors["location.venue"] = "Venue is required";
    if (!formData.location.address?.trim())
      newErrors["location.address"] = "Address is required";
    if (!formData.location.city?.trim())
      newErrors["location.city"] = "City is required";
    if (!formData.location.state?.trim())
      newErrors["location.state"] = "State is required";
    if (!formData.location.zipCode?.trim())
      newErrors["location.zipCode"] = "Zip code is required";

    // Numeric validation
    if (!formData.totalTickets || formData.totalTickets <= 0) {
      newErrors.totalTickets = "Total tickets must be greater than 0";
    }

    if (formData.ticketPrice < 0) {
      newErrors.ticketPrice = "Ticket price cannot be negative";
    }

    // Date validation
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (startDate < today) {
      newErrors.startDate = "Start date cannot be in the past";
    }

    if (endDate < startDate) {
      newErrors.endDate = "End date cannot be before start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4 className="mb-4">Event Information</h4>

      {/* Basic Event Information */}
      <Row className="mb-4">
        <Form.Group as={Col} md={8} className="mb-3">
          <Form.Label>
            Event Title <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            isInvalid={!!errors.title}
            placeholder="Enter a descriptive title"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.title}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md={4} className="mb-3">
          <Form.Label>
            Category <span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            isInvalid={!!errors.category}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.category}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label>
          Event Description <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          name="description"
          value={formData.description}
          onChange={handleChange}
          isInvalid={!!errors.description}
          placeholder="Provide a detailed description of your event"
          required
        />
        <Form.Control.Feedback type="invalid">
          {errors.description}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Date and Time */}
      <h4 className="mb-3">Date and Time</h4>
      <Row className="mb-4">
        <Form.Group as={Col} md={3} className="mb-3">
          <Form.Label>
            Start Date <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            isInvalid={!!errors.startDate}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.startDate}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md={3} className="mb-3">
          <Form.Label>
            End Date <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            isInvalid={!!errors.endDate}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.endDate}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md={3} className="mb-3">
          <Form.Label>
            Start Time <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            isInvalid={!!errors.startTime}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.startTime}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md={3} className="mb-3">
          <Form.Label>
            End Time <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            isInvalid={!!errors.endTime}
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.endTime}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      {/* Location */}
      <h4 className="mb-3">Location</h4>
      <Row className="mb-4">
        <Form.Group as={Col} md={6} className="mb-3">
          <Form.Label>
            Venue <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="location.venue"
            value={formData.location.venue}
            onChange={handleChange}
            isInvalid={!!errors["location.venue"]}
            placeholder="Venue name"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors["location.venue"]}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md={6} className="mb-3">
          <Form.Label>
            Address <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="location.address"
            value={formData.location.address}
            onChange={handleChange}
            isInvalid={!!errors["location.address"]}
            placeholder="Street address"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors["location.address"]}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md={4} className="mb-3">
          <Form.Label>
            City <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="location.city"
            value={formData.location.city}
            onChange={handleChange}
            isInvalid={!!errors["location.city"]}
            placeholder="City"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors["location.city"]}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md={4} className="mb-3">
          <Form.Label>
            State <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="location.state"
            value={formData.location.state}
            onChange={handleChange}
            isInvalid={!!errors["location.state"]}
            placeholder="State"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors["location.state"]}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md={4} className="mb-3">
          <Form.Label>
            Zip Code <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="location.zipCode"
            value={formData.location.zipCode}
            onChange={handleChange}
            isInvalid={!!errors["location.zipCode"]}
            placeholder="Zip code"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors["location.zipCode"]}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      {/* Tickets */}
      <h4 className="mb-3">Ticket Information</h4>
      <Row className="mb-4">
        <Form.Group as={Col} md={6} className="mb-3">
          <Form.Label>
            Total Tickets <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="number"
            name="totalTickets"
            value={formData.totalTickets}
            onChange={handleNumericChange}
            isInvalid={!!errors.totalTickets}
            min="1"
            required
          />
          <Form.Text className="text-muted">
            Maximum number of tickets available for this event
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            {errors.totalTickets}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group as={Col} md={6} className="mb-3">
          <Form.Label>
            Ticket Price ($) <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="number"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleNumericChange}
            isInvalid={!!errors.ticketPrice}
            min="0"
            step="0.01"
            required
          />
          <Form.Text className="text-muted">Set to 0 for free events</Form.Text>
          <Form.Control.Feedback type="invalid">
            {errors.ticketPrice}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>

      {/* Tags */}
      <Form.Group className="mb-4">
        <Form.Label>Tags</Form.Label>
        <Form.Control
          type="text"
          value={tagsInput}
          onChange={handleTagsChange}
          placeholder="Enter tags separated by commas (e.g., music, live, outdoor)"
        />
        <Form.Text className="text-muted">
          Tags help attendees find your event more easily
        </Form.Text>
      </Form.Group>

      {/* Submit Button */}
      <div className="d-grid mb-3">
        <Button variant="primary" type="submit" size="lg" disabled={loading}>
          {loading ? "Processing..." : buttonText}
        </Button>
      </div>

      <div className="text-muted text-center">
        <small>
          Fields marked with <span className="text-danger">*</span> are required
        </small>
      </div>
    </Form>
  );
};

export default EventForm;
