// src/services/ticketService.js
import axios from "axios";

// Book tickets
export const bookTickets = async (eventId, quantity) => {
  try {
    const response = await axios.post("/tickets", {
      eventId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error booking tickets:", error);
    throw error.response?.data?.message || "Error booking tickets";
  }
};

// Get tickets for a specific user (admin only)
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

// Get tickets for a specific event (organizer only)
export const getEventTickets = async (eventId, page = 1, limit = 20) => {
  try {
    const response = await axios.get(`/tickets/event/${eventId}`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching event tickets:", error);
    throw error.response?.data?.message || "Error fetching event tickets";
  }
};

// Verify ticket (organizer only)
export const verifyTicket = async (ticketNumber) => {
  try {
    // First, find the ticket by its number
    const response = await axios.get(`/tickets/by-number/${ticketNumber}`);
    const ticketId = response.data._id;

    // Then verify the ticket using its ID
    const verifyResponse = await axios.get(`/tickets/${ticketId}/verify`);
    return {
      ...verifyResponse.data,
      ticketId: ticketId, // Add ticketId to the response for later use
    };
  } catch (error) {
    console.error("Error verifying ticket:", error);
    throw error.response?.data?.message || "Error verifying ticket";
  }
};

// Mark ticket as used (organizer only)
export const markTicketAsUsed = async (ticketId) => {
  try {
    const response = await axios.put(`/tickets/${ticketId}/mark-used`);
    return response.data;
  } catch (error) {
    console.error("Error marking ticket as used:", error);
    throw error.response?.data?.message || "Error marking ticket as used";
  }
};