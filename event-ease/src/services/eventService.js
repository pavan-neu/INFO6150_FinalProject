// src/services/eventService.js
import axios from "axios";

// Base URL should be set in AuthContext

// Get featured events
export const getFeaturedEvents = async () => {
  try {
    const response = await axios.get("/events/featured");
    return response.data;
  } catch (error) {
    console.error("Error fetching featured events:", error);
    throw error;
  }
};

// Get upcoming events
export const getUpcomingEvents = async (page = 1, limit = 6) => {
  try {
    const response = await axios.get(
      `/events/upcoming?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    throw error;
  }
};

// Get event by id
export const getEventById = async (id) => {
  try {
    const response = await axios.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    throw error;
  }
};

// Search events
export const searchEvents = async (
  query = "",
  page = 1,
  limit = 10,
  category = ""
) => {
  try {
    let url = `/events/search?page=${page}&limit=${limit}`;

    if (query) {
      url += `&query=${encodeURIComponent(query)}`;
    }

    const response = await axios.get(url);

    // Filter by category if provided
    if (category && response.data && response.data.events) {
      const filteredEvents = response.data.events.filter(
        (event) => event.category === category
      );

      // Update the response data with filtered events
      return {
        ...response.data,
        events: filteredEvents,
        total: filteredEvents.length,
        pages: Math.ceil(filteredEvents.length / limit),
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error searching events:", error);
    throw error;
  }
};

// Get all events with optional filters
export const getEvents = async (params = {}) => {
  try {
    // If there's a category filter, we need to handle it specially
    // because the backend might not support direct category filtering
    const { category, ...otherParams } = params;

    const response = await axios.get("/events", { params: otherParams });

    // If category filter is provided, filter the results in the frontend
    if (category && response.data && response.data.events) {
      const filteredEvents = response.data.events.filter(
        (event) => event.category === category
      );

      // Update the response data with filtered events
      return {
        ...response.data,
        events: filteredEvents,
        total: filteredEvents.length,
        pages: Math.ceil(filteredEvents.length / (params.limit || 10)),
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const response = await axios.post("/events", eventData);
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

// Update an event
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axios.put(`/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

// Cancel an event
export const cancelEvent = async (eventId) => {
  try {
    const response = await axios.put(`/events/${eventId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling event:", error);
    throw error;
  }
};

// Upload event image
export const uploadEventImage = async (eventId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axios.post(`/events/${eventId}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading event image:", error);
    throw error;
  }
};
