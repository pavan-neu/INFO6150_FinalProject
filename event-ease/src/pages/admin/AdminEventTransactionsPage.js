// src/pages/admin/AdminEventTransactionsPage.js
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
  Row,
  Col,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AdminLayout from "../../components/layout/AdminLayout";
import Pagination from "../../components/ui/Pagination";
import { getEventById } from "../../services/eventService";
import { getEventTransactions } from "../../services/transactionService";
import { useToast } from "../../context/ToastContext";

const AdminEventTransactionsPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [salesData, setSalesData] = useState([]);
  const [dateRange, setDateRange] = useState("all");
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

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getEventTransactions(eventId, page, 20);

      let filteredTransactions = data.transactions || [];

      // Client-side filtering by status
      if (filterStatus) {
        filteredTransactions = filteredTransactions.filter(
          (transaction) => transaction.status === filterStatus
        );
      }

      // Client-side search by transaction ID or customer name
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredTransactions = filteredTransactions.filter(
          (transaction) =>
            transaction._id.toLowerCase().includes(query) ||
            (transaction.user &&
              transaction.user.name?.toLowerCase().includes(query))
        );
      }

      setTransactions(filteredTransactions);
      setTotalPages(Math.ceil(filteredTransactions.length / 20) || 1);
      setTotalRevenue(data.totalRevenue || 0);

      // Process transactions data for charts
      processTransactionsData(filteredTransactions);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching transactions:", err);

      // If it's a 404, don't show it as an error
      if (err.response?.status === 404) {
        setTransactions([]);
        setTotalRevenue(0);
        setSalesData([]);
        setError(""); // Clear any error message
      } else {
        setError("Failed to load transactions. Please try again.");
      }

      setLoading(false);
    }
  }, [eventId, page, searchQuery, filterStatus]);

  // Process transactions data for charts
  const processTransactionsData = (transactionsData) => {
    const groupedByDate = {};

    // Filter by date range if needed
    const now = new Date();
    const filteredTransactions = transactionsData.filter((transaction) => {
      if (dateRange === "all") return true;

      const transactionDate = new Date(transaction.createdAt);
      const diffTime = Math.abs(now - transactionDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (dateRange === "week") return diffDays <= 7;
      if (dateRange === "month") return diffDays <= 30;

      return true;
    });

    // Group by date
    filteredTransactions.forEach((transaction) => {
      const date = transaction.createdAt
        ? new Date(transaction.createdAt).toLocaleDateString()
        : "Unknown Date";

      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date,
          sales: 0,
          revenue: 0,
        };
      }

      groupedByDate[date].sales += 1;
      groupedByDate[date].revenue += transaction.amount || 0;
    });

    // Convert to array and sort by date
    const salesDataArray = Object.values(groupedByDate);
    salesDataArray.sort((a, b) => {
      if (a.date === "Unknown Date") return 1;
      if (b.date === "Unknown Date") return -1;
      return new Date(a.date) - new Date(b.date);
    });

    setSalesData(salesDataArray);
  };

  // Load data on mount
  useEffect(() => {
    fetchEvent();
    fetchTransactions();
  }, [fetchEvent, fetchTransactions]);

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
  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setPage(1); // Reset to first page when filtering
  };

  // Handle date range change
  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
    // Re-process transaction data with the new date range
    processTransactionsData(transactions);
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

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge bg="success">Completed</Badge>;
      case "pending":
        return <Badge bg="warning">Pending</Badge>;
      case "cancelled":
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status || "Unknown"}</Badge>;
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
              <li className="breadcrumb-item active">Transactions</li>
            </ol>
          </nav>
          <h2 className="mb-0">Event Transactions</h2>
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

      {/* Revenue statistics */}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Revenue Overview</h5>
          <Form.Select
            value={dateRange}
            onChange={handleDateRangeChange}
            className="ms-auto"
            style={{ width: "200px" }}
          >
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </Form.Select>
        </Card.Header>
        <Card.Body>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="h-100 border-0">
                <Card.Body className="text-center">
                  <h6 className="text-muted mb-2">Total Revenue</h6>
                  <h2 className="text-success">${totalRevenue.toFixed(2)}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0">
                <Card.Body className="text-center">
                  <h6 className="text-muted mb-2">Transactions</h6>
                  <h2>{transactions.length}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0">
                <Card.Body className="text-center">
                  <h6 className="text-muted mb-2">Average Value</h6>
                  <h2>
                    {transactions.length > 0
                      ? `$${(totalRevenue / transactions.length).toFixed(2)}`
                      : "$0.00"}
                  </h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Revenue Chart */}
          <div style={{ height: "300px" }}>
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#28a745"
                    activeDot={{ r: 8 }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-5 text-muted">
                <p>No transaction data available for the selected period</p>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Transactions List */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Transactions</h5>

          <div className="d-flex">
            <InputGroup style={{ width: "250px" }}>
              <InputGroup.Text>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </InputGroup>

            <Form.Select
              value={filterStatus}
              onChange={handleStatusFilterChange}
              className="ms-2"
              style={{ width: "150px" }}
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </Form.Select>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-5">
              <i
                className="bi bi-cash-coin text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h4 className="mt-3">No Transactions Found</h4>
              <p className="text-muted mb-3">
                {searchQuery || filterStatus
                  ? "No transactions match your search or filter criteria."
                  : "No transactions have been made for this event yet."}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Date & Time</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{transaction._id.slice(-8).toUpperCase()}</td>
                      <td>
                        {formatDate(transaction.createdAt)}
                        <small className="d-block text-muted">
                          {formatTime(transaction.createdAt)}
                        </small>
                      </td>
                      <td>
                        {transaction.user ? (
                          <Link
                            to={`/admin/users/${transaction.user._id}`}
                            className="text-decoration-none"
                          >
                            {transaction.user.name}
                          </Link>
                        ) : (
                          "Unknown"
                        )}
                      </td>
                      <td>${(transaction.amount || 0).toFixed(2)}</td>
                      <td>{getStatusBadge(transaction.status)}</td>
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
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default AdminEventTransactionsPage;