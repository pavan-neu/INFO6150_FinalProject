// src/services/eventService.js
import axios from "axios";

// Base URL is set in AuthContext

const getEvents = async (params = {}) => {
  try {
    const response = await axios.get("/events", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getFeaturedEvents = async () => {
  try {
    const response = await axios.get("/events/featured");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getUpcomingEvents = async (limit = 6) => {
  try {
    const response = await axios.get(`/events/upcoming?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getEventById = async (id) => {
  try {
    const response = await axios.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const searchEvents = async (query, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `/events/search?query=${query}&page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const eventService = {
  getEvents,
  getFeaturedEvents,
  getUpcomingEvents,
  getEventById,
  searchEvents,
};
