// src/services/transactionService.js
import axios from "axios";

// Get transactions for a specific user (admin only)
export const getUserTransactions = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`/transactions/my-transactions`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    throw error;
  }
};

// Get transaction by ID
export const getTransactionById = async (transactionId) => {
  try {
    const response = await axios.get(`/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    throw error;
  }
};

// Get transaction status
export const getTransactionStatus = async (transactionId) => {
  try {
    const response = await axios.get(`/transactions/${transactionId}/status`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction status:", error);
    throw error;
  }
};

// Get event transactions (organizer only)
export const getEventTransactions = async (eventId, page = 1, limit = 100) => {
  try {
    const response = await axios.get(`/transactions/event/${eventId}`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching event transactions:", error);
    throw error.response?.data?.message || "Error fetching event transactions";
  }
};

// Create transaction
export const createTransaction = async (ticketId, paymentMethod, paymentId) => {
  try {
    const response = await axios.post("/transactions", {
      ticketId,
      paymentMethod,
      paymentId,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error.response?.data?.message || "Error creating transaction";
  }
};
