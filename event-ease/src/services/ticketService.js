// src/services/ticketService.js
import axios from "axios";

// Get user tickets with pagination
export const getUserTickets = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `/tickets/my-tickets?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    throw error;
  }
};

// Get ticket by ID
export const getTicketById = async (ticketId) => {
  try {
    const response = await axios.get(`/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    throw error;
  }
};

// Cancel ticket
export const cancelTicket = async (ticketId) => {
  try {
    const response = await axios.put(`/tickets/${ticketId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling ticket:", error);
    throw error;
  }
};
