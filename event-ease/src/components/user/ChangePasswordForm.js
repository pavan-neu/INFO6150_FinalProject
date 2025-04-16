// src/components/user/ChangePasswordForm.js
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { updatePassword } from "../../services/userService";

const ChangePasswordForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password
    if (!formData.currentPassword) {
      onError("Current password is required");
      return;
    }

    if (!formData.newPassword) {
      onError("New password is required");
      return;
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      onError(
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
      );
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      onError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await updatePassword(formData.currentPassword, formData.newPassword);
      onSuccess("Password updated successfully");
      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setLoading(false);
    } catch (err) {
      // Improved error handling
      if (err.response) {
        const errorMessage =
          err.response.data.message ||
          "An error occurred while updating password";
        onError(errorMessage);
      } else {
        onError("Connection error. Please try again later.");
      }
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h4 className="mb-4">Change Password</h4>

      <Form.Group className="mb-3">
        <Form.Label>
          Current Password <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          placeholder="Enter your current password"
          required
        />
        <Form.Text className="text-muted">
          You must enter your current password correctly to make changes.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          New Password <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="Enter your new password"
          required
        />
        <Form.Text className="text-muted">
          Password must contain at least 8 characters, one uppercase, one
          lowercase, one number and one special character.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>
          Confirm New Password <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your new password"
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Password"}
      </Button>
    </Form>
  );
};

export default ChangePasswordForm;
