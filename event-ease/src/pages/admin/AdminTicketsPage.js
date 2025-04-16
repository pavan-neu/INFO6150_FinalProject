// src/pages/admin/AdminTicketsPage.js
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Nav,
  Tab,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import Pagination from "../../components/ui/Pagination";
import { getAllTickets, markTicketAsUsed, cancelTicket } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

const AdminTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [ticketStats, setTicketStats] = useState({
    reserved: 0,
    paid: 0,
    used: 0,
    cancelled: 0,
  });
  const { showToast } = useToast();

  // Fetch tickets
  // Update the fetchTickets function in AdminTicketsPage.js
const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError("");
  
    try {
      const params = {
        page,
        limit: 20,
        status: filterStatus || undefined,
        search: searchQuery || undefined,
      };
  
      const data = await getAllTickets(params);
      
      // Even if the API returns a 404, consider it as "no tickets yet" rather than an error
      setTickets(data?.tickets || []);
      setTotalPages(data?.pages || 1);
      
      // Set ticket statistics if available
      if (data?.countsByStatus) {
        setTicketStats(data.countsByStatus);
      } else {
        // Default empty statistics
        setTicketStats({
          reserved: 0,
          paid: 0,
          used: 0,
          cancelled: 0
        });
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      
      // If it's a 404, don't show it as an error
      if (err.response?.status === 404) {
        setTickets([]);
        setTicketStats({
          reserved: 0,
          paid: 0,
          used: 0,
          cancelled: 0
        });
        setError(""); // Clear any error message
      } else {
        setError("Failed to load tickets. Please try again.");
      }
      setLoading(false);
    }
  }, [page, searchQuery, filterStatus]);

  // Load tickets on mount and when dependencies change
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setFilterStatus(status);
    setPage(1); // Reset to first page when filtering
  };

  // Handle marking ticket as used
  const handleMarkAsUsed = async (ticketId) => {
    try {
      await markTicketAsUsed(ticketId);
      showToast("Ticket marked as used successfully", "success");
      fetchTickets(); // Refresh the ticket list
    } catch (err) {
      console.error("Error marking ticket as used:", err);
      showToast("Failed to mark ticket as used", "danger");
    }
  };

  // Handle canceling ticket
  const handleCancelTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) {
      return;
    }
    
    try {
      await cancelTicket(ticketId);
      showToast("Ticket cancelled successfully", "success");
      fetchTickets(); // Refresh the ticket list
    } catch (err) {
      console.error("Error cancelling ticket:", err);
      showToast("Failed to cancel ticket", "danger");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "reserved":
        return <Badge bg="warning">Reserved</Badge>;
      case "paid":
        return <Badge bg="success">Paid</Badge>;
      case "used":
        return <Badge bg="info">Used</Badge>;
      case "cancelled":
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Ticket Management</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Ticket statistics cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <Card className="text-center h-100 bg-light">
            <Card.Body>
              <h6 className="text-muted mb-2">All Tickets</h6>
              <h3>{
                (ticketStats.reserved || 0) + 
                (ticketStats.paid || 0) + 
                (ticketStats.used || 0) + 
                (ticketStats.cancelled || 0)
              }</h3>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-9">
          <Card className="h-100">
            <Card.Body>
              <div className="row text-center g-2">
                <div className="col-3">
                  <h6 className="text-warning mb-2">Reserved</h6>
                  <h3>{ticketStats.reserved || 0}</h3>
                </div>
                <div className="col-3">
                  <h6 className="text-success mb-2">Paid</h6>
                  <h3>{ticketStats.paid || 0}</h3>
                </div>
                <div className="col-3">
                  <h6 className="text-info mb-2">Used</h6>
                  <h3>{ticketStats.used || 0}</h3>
                </div>
                <div className="col-3">
                  <h6 className="text-danger mb-2">Cancelled</h6>
                  <h3>{ticketStats.cancelled || 0}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Tab navigation for different ticket statuses */}
      <Tab.Container defaultActiveKey="all">
        <Card className="shadow-sm mb-4">
          <Card.Header>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="all" onClick={() => handleStatusFilterChange("")}>All Tickets</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reserved" onClick={() => handleStatusFilterChange("reserved")}>
                  Reserved <Badge bg="warning">{ticketStats.reserved || 0}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="paid" onClick={() => handleStatusFilterChange("paid")}>
                  Paid <Badge bg="success">{ticketStats.paid || 0}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="used" onClick={() => handleStatusFilterChange("used")}>
                  Used <Badge bg="info">{ticketStats.used || 0}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="cancelled" onClick={() => handleStatusFilterChange("cancelled")}>
                  Cancelled <Badge bg="danger">{ticketStats.cancelled || 0}</Badge>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by ticket number, event, or attendee..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </div>

            <Tab.Content>
              <Tab.Pane eventKey="all" active={filterStatus === ""}>
                {renderTicketsTable()}
              </Tab.Pane>
              <Tab.Pane eventKey="reserved" active={filterStatus === "reserved"}>
                {renderTicketsTable()}
              </Tab.Pane>
              <Tab.Pane eventKey="paid" active={filterStatus === "paid"}>
                {renderTicketsTable()}
              </Tab.Pane>
              <Tab.Pane eventKey="used" active={filterStatus === "used"}>
                {renderTicketsTable()}
              </Tab.Pane>
              <Tab.Pane eventKey="cancelled" active={filterStatus === "cancelled"}>
                {renderTicketsTable()}
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </AdminLayout>
  );

  // Function to render tickets table
  function renderTicketsTable() {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading tickets...</p>
        </div>
      );
    }

    if (tickets.length === 0) {
      return (
        <div className="text-center py-5">
          <i className="bi bi-ticket-perforated text-muted" style={{ fontSize: "3rem" }}></i>
          <h4 className="mt-3">No Tickets Found</h4>
          <p className="text-muted mb-3">
            {searchQuery || filterStatus
              ? "No tickets match your search or filter criteria."
              : "No tickets have been issued yet."}
          </p>
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <Table hover className="align-middle">
          <thead>
            <tr>
              <th>Ticket Number</th>
              <th>Event</th>
              <th>Attendee</th>
              <th>Purchase Date</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>
                  <Link to={`/admin/tickets/${ticket._id}`} className="text-decoration-none">
                    {ticket.ticketNumber}
                  </Link>
                </td>
                <td>
                  {ticket.event ? (
                    <Link to={`/admin/events/${ticket.event._id}`} className="text-decoration-none">
                      {ticket.event.title}
                    </Link>
                  ) : (
                    "Unknown Event"
                  )}
                </td>
                <td>
                  {ticket.user ? (
                    <Link to={`/admin/users/${ticket.user._id}`} className="text-decoration-none">
                      {ticket.user.name}
                    </Link>
                  ) : (
                    "Unknown"
                  )}
                </td>
                <td>
                  {formatDate(ticket.purchaseDate)}
                </td>
                <td>${ticket.price.toFixed(2)}</td>
                <td>{getStatusBadge(ticket.status)}</td>
                <td>
                  <div className="btn-group">
                    <Button
                      as={Link}
                      to={`/admin/tickets/${ticket._id}`}
                      variant="outline-primary"
                      size="sm"
                    >
                      Details
                    </Button>
                    {ticket.status === "paid" && (
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleMarkAsUsed(ticket._id)}
                      >
                        Mark Used
                      </Button>
                    )}
                    {(ticket.status === "reserved" || ticket.status === "paid") && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleCancelTicket(ticket._id)}
                      >
                        Cancel
                      </Button>
                    )}
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
    );
  }
};

export default AdminTicketsPage;