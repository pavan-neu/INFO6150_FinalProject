// src/services/userService.js
import axios from "axios";

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Update user's name
export const updateName = async (name) => {
  try {
    const response = await axios.put("/users/profile/name", { name });
    return response.data;
  } catch (error) {
    console.error("Error updating name:", error);
    throw error;
  }
};

// Update user's email
export const updateEmail = async (email) => {
  try {
    const response = await axios.put("/users/profile/email", { email });
    return response.data;
  } catch (error) {
    console.error("Error updating email:", error);
    throw error;
  }
};

// Update user's username
export const updateUsername = async (username) => {
  try {
    const response = await axios.put("/users/profile/username", { username });
    return response.data;
  } catch (error) {
    console.error("Error updating username:", error);
    throw error;
  }
};

// Update user's password
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    // Make sure both passwords are provided
    if (!currentPassword || !newPassword) {
      throw new Error("Both current and new passwords are required");
    }

    const response = await axios.put("/users/profile/password", {
      currentPassword,
      password: newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

// Upload profile image
export const uploadProfileImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axios.post("/users/profile/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};
