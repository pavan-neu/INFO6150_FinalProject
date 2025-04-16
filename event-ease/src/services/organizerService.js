// src/services/organizerService.js
import axios from "axios";

// Get organizer dashboard statistics
export const getOrganizerStats = async () => {
  try {
    // This endpoint would need to be implemented on your backend
    const response = await axios.get("/organizer/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching organizer stats:", error);
    throw error;
  }
};

// Get organizer events with pagination
export const getOrganizerEvents = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `/events/my-events?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    throw error;
  }
};

// Cancel event
export const cancelEvent = async (eventId) => {
  try {
    const response = await axios.put(`/events/${eventId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling event:", error);
    throw error;
  }
};

// Get ticket sales by event
export const getEventTickets = async (eventId, page = 1, limit = 20) => {
  try {
    const response = await axios.get(
      `/tickets/event/${eventId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching event tickets:", error);
    throw error;
  }
};

// Get transactions by event
export const getEventTransactions = async (eventId, page = 1, limit = 20) => {
  try {
    const response = await axios.get(
      `/transactions/event/${eventId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching event transactions:", error);
    throw error;
  }
};
