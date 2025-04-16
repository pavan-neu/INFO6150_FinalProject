// src/pages/admin/UserDetailPage.js
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Form,
  Badge,
  ListGroup,
  Tab,
  Nav,
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
      // Only send the fields we want to update
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        role: formData.role,
        active: formData.active,
      };

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
            {editing ? (
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            ) : (
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={() => setEditing(true)}
              >
                Edit User
              </Button>
            )}
            <Button
              variant="outline-danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete User
            </Button>
          </div>
        </div>
      </div>

      <Row>
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div
                className="avatar mb-3"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  backgroundColor: "#e9ecef",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.5rem",
                  margin: "0 auto",
                }}
              >
                {user.name[0].toUpperCase()}
              </div>
              <h4>{user.name}</h4>
              <p className="text-muted mb-1">{user.email}</p>
              <p className="mb-3">
                {getRoleBadge(user.role)}
                <Badge bg={user.active ? "success" : "danger"} className="ms-2">
                  {user.active ? "Active" : "Inactive"}
                </Badge>
              </p>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">User Information</h5>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col md={4} className="text-muted">
                    Username
                  </Col>
                  <Col md={8}>{user.username}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={4} className="text-muted">
                    Joined
                  </Col>
                  <Col md={8}>
                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col md={4} className="text-muted">
                    Last Updated
                  </Col>
                  <Col md={8}>
                    {new Date(user.updatedAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col lg={8}>
          {editing ? (
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Edit User</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
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

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Active"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                    />
                  </Form.Group>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button
                      variant="secondary"
                      onClick={() => setEditing(false)}
                    >
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
            <Tab.Container defaultActiveKey="activity">
              <Card className="mb-4">
                <Card.Header>
                  <Nav variant="tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="activity">Activity</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="tickets">Tickets</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="transactions">Transactions</Nav.Link>
                    </Nav.Item>
                    {user.role === "organizer" && (
                      <Nav.Item>
                        <Nav.Link eventKey="events">Events</Nav.Link>
                      </Nav.Item>
                    )}
                  </Nav>
                </Card.Header>
                <Card.Body>
                  <Tab.Content>
                    <Tab.Pane eventKey="activity">
                      <div className="text-center py-5">
                        <i
                          className="bi bi-activity text-muted"
                          style={{ fontSize: "3rem" }}
                        ></i>
                        <h5 className="mt-3">User Activity</h5>
                        <p className="text-muted">
                          Activity tracking is not implemented yet. Check back
                          later.
                        </p>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="tickets">
                      <div className="text-center py-5">
                        <i
                          className="bi bi-ticket-perforated text-muted"
                          style={{ fontSize: "3rem" }}
                        ></i>
                        <h5 className="mt-3">User Tickets</h5>
                        <p className="text-muted">
                          Ticket history will be displayed here. Implementation
                          in progress.
                        </p>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="transactions">
                      <div className="text-center py-5">
                        <i
                          className="bi bi-cash-coin text-muted"
                          style={{ fontSize: "3rem" }}
                        ></i>
                        <h5 className="mt-3">Transaction History</h5>
                        <p className="text-muted">
                          Transaction history will be displayed here.
                          Implementation in progress.
                        </p>
                      </div>
                    </Tab.Pane>
                    {user.role === "organizer" && (
                      <Tab.Pane eventKey="events">
                        <div className="text-center py-5">
                          <i
                            className="bi bi-calendar-event text-muted"
                            style={{ fontSize: "3rem" }}
                          ></i>
                          <h5 className="mt-3">User Events</h5>
                          <p className="text-muted">
                            Events created by this organizer will be displayed
                            here. Implementation in progress.
                          </p>
                        </div>
                      </Tab.Pane>
                    )}
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          )}
        </Col>
      </Row>

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
