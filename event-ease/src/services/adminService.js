// src/services/adminService.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Helper function to check token validity
const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Helper function to ensure authorization headers are set
const ensureAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// Get all users with pagination (admin only)
export const getUsers = async (params = {}) => {
  try {
    // Ensure valid token and auth headers
    if (!isTokenValid()) {
      console.warn("Invalid or expired token when fetching users");
    }
    // Make sure headers are set before the request
    ensureAuthHeaders();
    const response = await axios.get("/users", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Get user by ID (admin only)
export const getUserById = async (userId) => {
  try {
    // Ensure auth headers are set
    ensureAuthHeaders();
    const response = await axios.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

// Update user (admin only)
export const updateUser = async (userId, userData) => {
  try {
    // Ensure auth headers are set
    ensureAuthHeaders();
    const response = await axios.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete user (admin only)
export const deleteUser = async (userId) => {
  try {
    // Ensure auth headers are set
    ensureAuthHeaders();
    const response = await axios.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Feature or unfeature event (admin only)
export const featureEvent = async (
  eventId,
  isFeatured = true,
  featureNote = ""
) => {
  try {
    // Ensure auth headers are set
    ensureAuthHeaders();
    const response = await axios.put(`/events/${eventId}/feature`, {
      isFeatured,
      featureNote,
    });
    return response.data;
  } catch (error) {
    console.error("Error featuring event:", error);
    throw error;
  }
};

// Update getAllTickets in adminService.js
export const getAllTickets = async (params = {}) => {
  try {
    // Ensure auth headers are set
    ensureAuthHeaders();
    const response = await axios.get("/tickets", { params });
    return response.data;
  } catch (error) {
    // Let the component handle the error
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

// Update getAllTransactions similarly
export const getAllTransactions = async (params = {}) => {
  try {
    // Ensure auth headers are set
    ensureAuthHeaders();
    const response = await axios.get("/transactions", { params });
    return response.data;
  } catch (error) {
    // Let the component handle the error
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
// Cancel transaction (admin only)
export const cancelTransaction = async (transactionId) => {
  try {
    // Ensure auth headers are set
    ensureAuthHeaders();
    const response = await axios.put(`/transactions/${transactionId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling transaction:", error);
    throw error;
  }
}; // Add these functions to your existing adminService.js

// Mark ticket as used (admin only)
export const markTicketAsUsed = async (ticketId) => {
  try {
    // Ensure auth headers are set
    ensureAuthHeaders();
    const response = await axios.put(`/tickets/${ticketId}/mark-used`);
    return response.data;
  } catch (error) {
    console.error("Error marking ticket as used:", error);
    throw error;
  }
};

// Cancel ticket (admin only)
export const cancelTicket = async (ticketId) => {
  try {
    // Ensure auth headers are set
    ensureAuthHeaders();
    const response = await axios.put(`/tickets/${ticketId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling ticket:", error);
    throw error;
  }
};