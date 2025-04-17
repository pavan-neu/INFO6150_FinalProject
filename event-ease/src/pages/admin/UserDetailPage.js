// src/pages/admin/UserDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  getUserById,
  updateUser,
  deleteUser,
} from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

const UserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    role: "",
    active: true,
    password: "",
  });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userData = await getUserById(userId);
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          username: userData.username,
          role: userData.role,
          active: userData.active,
          password: "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user details. Please try again.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a copy of the form data
      const dataToSend = { ...formData };

      // Only include password in the request if it's not empty
      if (!dataToSend.password || dataToSend.password.trim() === "") {
        delete dataToSend.password;
      }

      await updateUser(userId, dataToSend);
      showToast("User updated successfully", "success");

      // Refresh user data
      const updatedUser = await getUserById(userId);
      setUser(updatedUser);

      setEditing(false);
    } catch (err) {
      console.error("Error updating user:", err);
      showToast(
        "Failed to update user: " +
          (err.response?.data?.message || err.message),
        "danger"
      );
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    try {
      await deleteUser(userId);
      showToast("User deleted successfully", "success");
      navigate("/admin/users");
    } catch (err) {
      console.error("Error deleting user:", err);
      showToast("Failed to delete user", "danger");
    }
  };

  // Get role badge
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge bg="danger">Admin</Badge>;
      case "organizer":
        return <Badge bg="primary">Organizer</Badge>;
      case "user":
        return <Badge bg="info">User</Badge>;
      default:
        return <Badge bg="secondary">{role}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading user details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <Alert variant="warning">
          User not found or you don't have permission to view this user.
        </Alert>
        <Button variant="primary" onClick={() => navigate("/admin/users")}>
          Return to User Management
        </Button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header with breadcrumb navigation */}
      <div className="mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/admin/users">Users</Link>
            </li>
            <li className="breadcrumb-item active">{user.name}</li>
          </ol>
        </nav>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">User Details</h2>
          <div>
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={() => setEditing(true)}
              disabled={editing}
            >
              Edit User
            </Button>
            <Button
              variant="outline-danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete User
            </Button>
          </div>
        </div>
      </div>

      {editing ? (
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Edit User</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="user">User</option>
                      <option value="organizer">Organizer</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Note: Admins have management access but cannot create
                      events. Organizers can create and manage their own events.
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Password (leave blank to keep current)
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter new password or leave blank"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  label="Active Account"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Button variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={3}>
                <div className="text-center">
                  <div
                    className="avatar mb-3"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      backgroundColor: "#e9ecef",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                      margin: "0 auto",
                    }}
                  >
                    {user.name[0].toUpperCase()}
                  </div>
                  <h4 className="mb-1">{user.name}</h4>
                  <div className="mb-2">
                    {getRoleBadge(user.role)}
                    <Badge
                      bg={user.active ? "success" : "danger"}
                      className="ms-2"
                    >
                      {user.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setEditing(true)}
                    className="mt-2"
                  >
                    <i className="bi bi-pencil-square me-1"></i> Edit
                  </Button>
                </div>
              </Col>
              <Col md={9}>
                <div className="mb-4">
                  <h5 className="border-bottom pb-2 text-primary">
                    Contact Information
                  </h5>
                  <Row className="mb-2">
                    <Col md={3} className="text-muted">
                      Email:
                    </Col>
                    <Col md={9}>{user.email}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={3} className="text-muted">
                      Username:
                    </Col>
                    <Col md={9}>{user.username}</Col>
                  </Row>
                </div>

                <div>
                  <h5 className="border-bottom pb-2 text-primary">
                    Account Details
                  </h5>
                  <Row className="mb-2">
                    <Col md={3} className="text-muted">
                      Account Created:
                    </Col>
                    <Col md={9}>{formatDate(user.createdAt)}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={3} className="text-muted">
                      Last Updated:
                    </Col>
                    <Col md={9}>{formatDate(user.updatedAt)}</Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={3} className="text-muted">
                      Account Type:
                    </Col>
                    <Col md={9}>
                      {user.role === "admin"
                        ? "Administrator"
                        : user.role === "organizer"
                        ? "Event Organizer"
                        : "Standard User"}
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={3} className="text-muted">
                      Status:
                    </Col>
                    <Col md={9}>
                      {user.active ? (
                        <span className="text-success">
                          <i className="bi bi-check-circle-fill me-1"></i>Active
                        </span>
                      ) : (
                        <span className="text-danger">
                          <i className="bi bi-x-circle-fill me-1"></i>Inactive
                        </span>
                      )}
                    </Col>
                  </Row>
                </div>

                {user.role === "organizer" && (
                  <div className="mt-4">
                    <h5 className="border-bottom pb-2 text-primary">
                      Organizer Details
                    </h5>
                    <p className="text-muted mb-2">
                      This user can create and manage events on the platform.
                    </p>
                    <Button
                      as={Link}
                      to={`/admin/events`}
                      variant="outline-primary"
                      size="sm"
                    >
                      <i className="bi bi-calendar-event me-1"></i> View All
                      Events
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">
            Are you sure you want to permanently delete this user and all their
            associated data?
          </p>
          <div className="alert alert-danger">
            <strong>Warning:</strong> This action cannot be undone. All data
            associated with this user including tickets, events, and
            transactions will be permanently deleted.
          </div>
          <div className="mb-3">
            <strong>Name:</strong> {user.name}
          </div>
          <div className="mb-3">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="mb-0">
            <strong>Role:</strong> {user.role}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

export default UserDetailPage;