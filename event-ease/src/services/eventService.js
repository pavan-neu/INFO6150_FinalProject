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

    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error searching events:", error);
    throw error;
  }
};

// Get all events with optional filters
export const getEvents = async (params = {}) => {
  try {
    const response = await axios.get("/events", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
