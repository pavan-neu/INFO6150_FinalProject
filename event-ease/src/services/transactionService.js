// src/services/transactionService.js
import axios from "axios";

// Get user transactions with pagination
export const getUserTransactions = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `/transactions/my-transactions?page=${page}&limit=${limit}`
    );
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
