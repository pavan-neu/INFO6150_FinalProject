// src/pages/organizer/EventSalesPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  Table,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Form,
  Tab,
  Nav,
} from "react-bootstrap";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import OrganizerLayout from "../../components/layout/OrganizerLayout";
import { getEventById } from "../../services/eventService";
import { getEventTickets } from "../../services/ticketService";
import { getEventTransactions } from "../../services/transactionService";

const EventSalesPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketStats, setTicketStats] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("all"); // all, week, month
  const [totalRevenue, setTotalRevenue] = useState(0);

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

  // Fetch ticket statistics
  const fetchTicketStats = useCallback(async () => {
    try {
      const data = await getEventTickets(eventId, 1, 1);
      setTicketStats(data.countsByStatus || {});
    } catch (err) {
      console.error("Error fetching ticket stats:", err);
    }
  }, [eventId]);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      const data = await getEventTransactions(eventId);
      setTransactions(data.transactions || []);
      setTotalRevenue(data.totalRevenue || 0);

      // Process data for charts
      processTransactionsData(data.transactions || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  }, [eventId]);

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
      const date = new Date(transaction.createdAt).toLocaleDateString();

      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date,
          sales: 0,
          revenue: 0,
        };
      }

      groupedByDate[date].sales += 1;
      groupedByDate[date].revenue += transaction.amount;
    });

    // Convert to array and sort by date
    const salesDataArray = Object.values(groupedByDate);
    salesDataArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    setSalesData(salesDataArray);
  };

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchEvent(),
        fetchTicketStats(),
        fetchTransactions(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, [fetchEvent, fetchTicketStats, fetchTransactions]);

  // Handle date range change
  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
    // Reprocess transaction data for the new date range
    processTransactionsData(transactions);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <OrganizerLayout>
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading sales data...</p>
        </div>
      </OrganizerLayout>
    );
  }

  if (error) {
    return (
      <OrganizerLayout>
        <Alert variant="danger">{error}</Alert>
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      {/* Header with breadcrumb */}
      <div className="mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/organizer/events">My Events</Link>
            </li>
            <li className="breadcrumb-item active">
              {event ? event.title : "Loading..."}
            </li>
          </ol>
        </nav>
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Sales Dashboard</h2>
          <div className="d-flex">
            <Form.Select
              value={dateRange}
              onChange={handleDateRangeChange}
              className="me-2"
              style={{ width: "150px" }}
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </Form.Select>
            <Button
              variant="outline-primary"
              onClick={() => window.print()} // Simple print functionality
            >
              <i className="bi bi-printer me-2"></i> Print Report
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h6 className="text-muted mb-2">Total Revenue</h6>
              <h2 className="text-success mb-0">${totalRevenue.toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h6 className="text-muted mb-2">Tickets Sold</h6>
              <h2 className="mb-0">
                {(ticketStats.paid || 0) + (ticketStats.used || 0)}
              </h2>
              <small className="text-muted">
                out of {event ? event.totalTickets : 0}
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h6 className="text-muted mb-2">Check-ins</h6>
              <h2 className="mb-0">{ticketStats.used || 0}</h2>
              <small className="text-muted">
                {ticketStats.paid
                  ? `${Math.round(
                      (ticketStats.used /
                        (ticketStats.paid + ticketStats.used)) *
                        100
                    )}% attendance`
                  : "0% attendance"}
              </small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <h6 className="text-muted mb-2">Cancellations</h6>
              <h2 className="mb-0">{ticketStats.cancelled || 0}</h2>
              <small className="text-muted">
                {(ticketStats.paid || 0) +
                  (ticketStats.used || 0) +
                  (ticketStats.cancelled || 0) >
                0
                  ? `${Math.round(
                      (ticketStats.cancelled /
                        ((ticketStats.paid || 0) +
                          (ticketStats.used || 0) +
                          (ticketStats.cancelled || 0))) *
                        100
                    )}% cancel rate`
                  : "0% cancel rate"}
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Tab.Container defaultActiveKey="sales">
        <Card className="mb-4">
          <Card.Header>
            <Nav variant="tabs">
              <Nav.Item>
                <Nav.Link eventKey="sales">Sales Over Time</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="revenue">Revenue</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <div style={{ height: "300px" }}>
              <Tab.Content>
                <Tab.Pane eventKey="sales">
                  {salesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="sales"
                          fill="#8884d8"
                          name="Tickets Sold"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <p>No sales data available for the selected period</p>
                    </div>
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="revenue">
                  {salesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [
                            `$${value.toFixed(2)}`,
                            "Revenue",
                          ]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#82ca9d"
                          name="Revenue"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-5 text-muted">
                      <p>No revenue data available for the selected period</p>
                    </div>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </div>
          </Card.Body>
        </Card>
      </Tab.Container>

      {/* Recent Transactions */}
      <Card>
        <Card.Header>
          <h5 className="mb-0">Recent Transactions</h5>
        </Card.Header>
        <Card.Body>
          {transactions.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">
                No transactions found for this event.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Date & Time</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 10).map((transaction) => (
                    <tr key={transaction._id}>
                      <td>
                        <Link
                          to={`/organizer/transactions/${transaction._id}`}
                          className="text-decoration-none"
                        >
                          {transaction._id.slice(-8).toUpperCase()}
                        </Link>
                      </td>
                      <td>
                        {formatDate(transaction.createdAt)}
                        <small className="d-block text-muted">
                          {formatTime(transaction.createdAt)}
                        </small>
                      </td>
                      <td>
                        {transaction.user ? transaction.user.name : "Unknown"}
                      </td>
                      <td>${transaction.amount.toFixed(2)}</td>
                      <td>
                        {transaction.paymentMethod === "credit_card"
                          ? "Credit Card"
                          : transaction.paymentMethod}
                      </td>
                      <td>
                        <span
                          className={`badge bg-${
                            transaction.status === "completed"
                              ? "success"
                              : transaction.status === "pending"
                              ? "warning"
                              : "danger"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {transactions.length > 10 && (
                <div className="text-center mt-3">
                  <Button
                    as={Link}
                    to={`/organizer/events/${eventId}/transactions`}
                    variant="outline-primary"
                  >
                    View All Transactions
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </OrganizerLayout>
  );
};

export default EventSalesPage;
