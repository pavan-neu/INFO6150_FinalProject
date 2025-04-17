// src/pages/admin/AdminEventTicketsPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import AdminLayout from "../../components/layout/AdminLayout";
import Pagination from "../../components/ui/Pagination";
import { getEventById } from "../../services/eventService";
import { getEventTickets } from "../../services/ticketService";
import { useToast } from "../../context/ToastContext";

const AdminEventTicketsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
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

  // Fetch event details
  const fetchEvent = useCallback(async () => {
    try {
      const eventData = await getEventById(eventId);
      setEvent(eventData);
    } catch (err) {
      console.error("Error fetching event:", err);
      setError("Failed to load event details. Please try again.");
    }
  }, [eventId]);

  // Fetch tickets
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getEventTickets(eventId, page, 20);

      let filteredTickets = data.tickets || [];

      // Client-side filtering by status
      if (filterStatus) {
        filteredTickets = filteredTickets.filter(
          (ticket) => ticket.status === filterStatus
        );
      }

      // Client-side search by ticket number or attendee name
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredTickets = filteredTickets.filter(
          (ticket) =>
            ticket.ticketNumber?.toLowerCase().includes(query) ||
            (ticket.user && ticket.user.name?.toLowerCase().includes(query))
        );
      }

      setTickets(filteredTickets);
      setTotalPages(data.pages || 1);

      // Set ticket statistics
      if (data.countsByStatus) {
        setTicketStats(data.countsByStatus);
      } else {
        // Calculate stats from tickets
        const stats = {
          reserved: 0,
          paid: 0,
          used: 0,
          cancelled: 0,
        };

        filteredTickets.forEach((ticket) => {
          if (stats[ticket.status] !== undefined) {
            stats[ticket.status]++;
          }
        });

        setTicketStats(stats);
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
          cancelled: 0,
        });
        setError(""); // Clear any error message
      } else {
        setError("Failed to load tickets. Please try again.");
      }

      setLoading(false);
    }
  }, [eventId, page, searchQuery, filterStatus]);

  // Load event and tickets on mount and when dependencies change
  useEffect(() => {
    fetchEvent();
    fetchTickets();
  }, [fetchEvent, fetchTickets]);

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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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

  if (!event && !loading && !error) {
    return (
      <AdminLayout>
        <Alert variant="warning">
          Event not found or you don't have permission to view it.
        </Alert>
        <Button variant="primary" onClick={() => navigate("/admin/events")}>
          Return to Events
        </Button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header with breadcrumb navigation */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <Link to="/admin/dashboard">Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/admin/events">Events</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to={`/admin/events/${eventId}`}>
                  {event ? event.title : "Loading..."}
                </Link>
              </li>
              <li className="breadcrumb-item active">Tickets</li>
            </ol>
          </nav>
          <h2 className="mb-0">Event Tickets</h2>
        </div>
        <div className="mt-3 mt-md-0">
          <Button
            as={Link}
            to={`/admin/events/${eventId}`}
            variant="outline-primary"
          >
            <i className="bi bi-arrow-left me-2"></i> Back to Event
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Ticket statistics cards */}
      {event && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <Card className="text-center h-100">
              <Card.Body>
                <h6 className="text-muted mb-2">Total Capacity</h6>
                <h3>{event.totalTickets}</h3>
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
      )}

      {/* Tab navigation for different ticket statuses */}
      <Tab.Container defaultActiveKey="all">
        <Card className="shadow-sm mb-4">
          <Card.Header>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link
                  eventKey="all"
                  onClick={() => handleStatusFilterChange("")}
                >
                  All Tickets
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="reserved"
                  onClick={() => handleStatusFilterChange("reserved")}
                >
                  Reserved{" "}
                  <Badge bg="warning">{ticketStats.reserved || 0}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="paid"
                  onClick={() => handleStatusFilterChange("paid")}
                >
                  Paid <Badge bg="success">{ticketStats.paid || 0}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="used"
                  onClick={() => handleStatusFilterChange("used")}
                >
                  Used <Badge bg="info">{ticketStats.used || 0}</Badge>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="cancelled"
                  onClick={() => handleStatusFilterChange("cancelled")}
                >
                  Cancelled{" "}
                  <Badge bg="danger">{ticketStats.cancelled || 0}</Badge>
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
                  placeholder="Search by ticket number or attendee name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </InputGroup>
            </div>

            <Tab.Content>
              <Tab.Pane eventKey="all" active={filterStatus === ""}>
                {renderTicketsTable()}
              </Tab.Pane>
              <Tab.Pane
                eventKey="reserved"
                active={filterStatus === "reserved"}
              >
                {renderTicketsTable()}
              </Tab.Pane>
              <Tab.Pane eventKey="paid" active={filterStatus === "paid"}>
                {renderTicketsTable()}
              </Tab.Pane>
              <Tab.Pane eventKey="used" active={filterStatus === "used"}>
                {renderTicketsTable()}
              </Tab.Pane>
              <Tab.Pane
                eventKey="cancelled"
                active={filterStatus === "cancelled"}
              >
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
          <i
            className="bi bi-ticket-perforated text-muted"
            style={{ fontSize: "3rem" }}
          ></i>
          <h4 className="mt-3">No Tickets Found</h4>
          <p className="text-muted mb-3">
            {searchQuery || filterStatus
              ? "No tickets match your search or filter criteria."
              : "No tickets have been issued for this event yet."}
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
                <td>{ticket.ticketNumber}</td>
                <td>
                  {ticket.user ? (
                    <Link
                      to={`/admin/users/${ticket.user._id}`}
                      className="text-decoration-none"
                    >
                      {ticket.user.name}
                    </Link>
                  ) : (
                    "Unknown"
                  )}
                </td>
                <td>{formatDate(ticket.purchaseDate)}</td>
                <td>${ticket.price.toFixed(2)}</td>
                <td>{getStatusBadge(ticket.status)}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/admin/events/${eventId}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    View Event
                  </Button>
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

export default AdminEventTicketsPage;