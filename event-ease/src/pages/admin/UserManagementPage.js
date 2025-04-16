// src/pages/admin/UserManagementPage.js
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Spinner,
  Badge,
  Form,
  InputGroup,
  Modal,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import Pagination from "../../components/ui/Pagination";
import { getUsers, updateUser, deleteUser } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const { showToast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // First, fetch all users without filters
      const response = await getUsers();

      let filteredUsers = Array.isArray(response)
        ? response
        : response.users || [];

      // Apply client-side filtering
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query)
        );
      }

      if (filterRole) {
        filteredUsers = filteredUsers.filter(
          (user) => user.role === filterRole
        );
      }

      if (filterStatus !== "") {
        const isActive = filterStatus === "active";
        filteredUsers = filteredUsers.filter(
          (user) => user.active === isActive
        );
      }

      // Calculate pagination
      const totalItems = filteredUsers.length;
      const itemsPerPage = 10;
      const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);

      // Paginate the filtered results
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedUsers = filteredUsers.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      setUsers(paginatedUsers);
      setTotalPages(calculatedTotalPages);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);

      // Don't show authentication errors to user after page load
      if (err.response?.status === 401) {
        setError(""); // Clear error message for auth issues
        setUsers([]); // Set empty users array
      } else {
        setError("Failed to load users. Please try again.");
      }

      setLoading(false);
    }
  }, [page, searchQuery, filterRole, filterStatus]);

  // Load users on mount and when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  // Handle role filter change
  const handleRoleFilterChange = (e) => {
    setFilterRole(e.target.value);
    setPage(1); // Reset to first page when filtering
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setPage(1); // Reset to first page when filtering
  };

  // Handle user status toggle
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await updateUser(userId, { active: !currentStatus });
      showToast(
        `User ${currentStatus ? "deactivated" : "activated"} successfully`,
        "success"
      );
      fetchUsers(); // Refresh the users list
    } catch (err) {
      console.error("Error updating user status:", err);
      showToast("Failed to update user status", "danger");
    }
  };

  // Handle delete user modal
  const handleShowDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete._id);
      showToast("User deleted successfully", "success");
      setShowDeleteModal(false);
      fetchUsers(); // Refresh the users list
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

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">User Management</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm mb-4">
        <Card.Header>
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </div>
            <div className="col-md-3">
              <Form.Select value={filterRole} onChange={handleRoleFilterChange}>
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="organizer">Organizer</option>
                <option value="user">User</option>
              </Form.Select>
            </div>
            <div className="col-md-3">
              <Form.Select
                value={filterStatus}
                onChange={handleStatusFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-5">
              <i
                className="bi bi-people text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h4 className="mt-3">No Users Found</h4>
              <p className="text-muted mb-3">
                {searchQuery || filterRole || filterStatus
                  ? "No users match your search or filter criteria."
                  : "There are no users in the system yet."}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="avatar me-2"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              backgroundColor: "#e9ecef",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.2rem",
                            }}
                          >
                            {user.name[0].toUpperCase()}
                          </div>
                          <div>
                            <h6 className="mb-0">{user.name}</h6>
                            <small className="text-muted">{user.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{user.username}</td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>
                        <Badge bg={user.active ? "success" : "danger"}>
                          {user.active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td>
                        <div className="btn-group">
                          <Button
                            as={Link}
                            to={`/admin/users/${user._id}`}
                            variant="outline-primary"
                            size="sm"
                          >
                            View
                          </Button>
                          <Button
                            variant={
                              user.active
                                ? "outline-warning"
                                : "outline-success"
                            }
                            size="sm"
                            onClick={() =>
                              handleToggleUserStatus(user._id, user.active)
                            }
                          >
                            {user.active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleShowDeleteModal(user)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Delete User Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userToDelete && (
            <>
              <p className="mb-3">
                Are you sure you want to permanently delete this user and all
                their associated data?
              </p>
              <div className="alert alert-danger">
                <strong>Warning:</strong> This action cannot be undone. All data
                associated with this user including tickets, events, and
                transactions will be permanently deleted.
              </div>
              <div className="mb-3">
                <strong>Name:</strong> {userToDelete.name}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {userToDelete.email}
              </div>
              <div className="mb-0">
                <strong>Role:</strong> {userToDelete.role}
              </div>
            </>
          )}
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

export default UserManagementPage;
