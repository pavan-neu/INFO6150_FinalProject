// src/components/user/ProfileForm.js
import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import {
  updateName,
  updateEmail,
  updateUsername,
} from "../../services/userService";
import useAuth from "../../hooks/useAuth";

const ProfileForm = ({ user, onSuccess, onError }) => {
  const { updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
  });

  const [loading, setLoading] = useState({
    name: false,
    email: false,
    username: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      onError("Name cannot be empty");
      return;
    }

    try {
      setLoading({ ...loading, name: true });
      await updateName(formData.name);
      await updateProfile("name", formData.name);
      onSuccess("Name updated successfully");
      setLoading({ ...loading, name: false });
    } catch (err) {
      onError(err.response?.data?.message || "Failed to update name");
      setLoading({ ...loading, name: false });
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      onError("Email cannot be empty");
      return;
    }

    try {
      setLoading({ ...loading, email: true });
      await updateEmail(formData.email);
      await updateProfile("email", formData.email);
      onSuccess("Email updated successfully");
      setLoading({ ...loading, email: false });
    } catch (err) {
      onError(err.response?.data?.message || "Failed to update email");
      setLoading({ ...loading, email: false });
    }
  };

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      onError("Username cannot be empty");
      return;
    }

    try {
      setLoading({ ...loading, username: true });
      await updateUsername(formData.username);
      await updateProfile("username", formData.username);
      onSuccess("Username updated successfully");
      setLoading({ ...loading, username: false });
    } catch (err) {
      onError(err.response?.data?.message || "Failed to update username");
      setLoading({ ...loading, username: false });
    }
  };

  return (
    <Form>
      <h4 className="mb-4">Profile Information</h4>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3}>
          Name
        </Form.Label>
        <Col sm={7}>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
          />
        </Col>
        <Col sm={2}>
          <Button
            variant="primary"
            onClick={handleUpdateName}
            disabled={loading.name || formData.name === user?.name}
            className="w-100"
          >
            {loading.name ? "Updating..." : "Update"}
          </Button>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3}>
          Email
        </Form.Label>
        <Col sm={7}>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email address"
          />
        </Col>
        <Col sm={2}>
          <Button
            variant="primary"
            onClick={handleUpdateEmail}
            disabled={loading.email || formData.email === user?.email}
            className="w-100"
          >
            {loading.email ? "Updating..." : "Update"}
          </Button>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3}>
          Username
        </Form.Label>
        <Col sm={7}>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Your username"
          />
        </Col>
        <Col sm={2}>
          <Button
            variant="primary"
            onClick={handleUpdateUsername}
            disabled={loading.username || formData.username === user?.username}
            className="w-100"
          >
            {loading.username ? "Updating..." : "Update"}
          </Button>
        </Col>
      </Form.Group>
    </Form>
  );
};

export default ProfileForm;
