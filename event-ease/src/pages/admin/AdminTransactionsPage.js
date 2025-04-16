// src/pages/admin/AdminTransactionsPage.js
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
  Row,
  Col,
} from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import Pagination from "../../components/ui/Pagination";
import { getAllTransactions, cancelTransaction } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [dateRange, setDateRange] = useState("all"); // all, week, month
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const { showToast } = useToast();

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page,
        limit: 20,
        status: filterStatus || undefined,
        search: searchQuery || undefined,
      };

      const data = await getAllTransactions(params);
      
      setTransactions(data.transactions || []);
      setTotalPages(data.pages || 1);
      
      // Calculate total revenue
      const totalRev = (data.transactions || []).reduce(
        (sum, transaction) => transaction.status === "completed" ? sum + transaction.amount : sum, 
        0
      );
      setTotalRevenue(totalRev);
      
      // Process data for revenue chart
      processRevenueData(data.transactions || []);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions. Please try again.");
      setLoading(false);
    }
  }, [page, searchQuery, filterStatus]);

  // Process data for revenue chart
  const processRevenueData = (transactionsData) => {
    const groupedByDate = {};
    
    // Filter by date range
    const now = new Date();
    const filteredTransactions = transactionsData.filter(transaction => {
      if (dateRange === "all") return true;
      
      const transactionDate = new Date(transaction.createdAt);
      const diffTime = Math.abs(now - transactionDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (dateRange === "week") return diffDays <= 7;
      if (dateRange === "month") return diffDays <= 30;
      
      return true;
    });
    
    // Only include completed transactions in revenue data
    const completedTransactions = filteredTransactions.filter(
      transaction => transaction.status === "completed"
    );
    
    // Group by date
    completedTransactions.forEach(transaction => {
      const date = new Date(transaction.createdAt).toLocaleDateString();
      
      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          date,
          revenue: 0,
          count: 0,
        };
      }
      
      groupedByDate[date].revenue += transaction.amount;
      groupedByDate[date].count += 1;
    });
    
    // Convert to array and sort by date
    const dataArray = Object.values(groupedByDate);
    dataArray.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setRevenueData(dataArray);
  };

  // Load transactions on mount and when dependencies change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Update revenue data when date range changes
  useEffect(() => {
    if (transactions.length > 0) {
      processRevenueData(transactions);
    }
  }, [dateRange, transactions]);

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
  };

  // Handle transaction cancellation
  const handleCancelTransaction = async (transactionId) => {
    if (!window.confirm("Are you sure you want to cancel this transaction? This will also cancel the associated tickets.")) {
      return;
    }
    
    try {
      await cancelTransaction(transactionId);
      showToast("Transaction cancelled successfully", "success");
      fetchTransactions(); // Refresh the transactions list
    } catch (err) {
      console.error("Error cancelling transaction:", err);
      showToast("Failed to cancel transaction", "danger");
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

  // Format time
  const formatTime = (dateString) => {
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
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Transaction Management</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Revenue Overview */}
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
                  <h6 className="text-muted mb-2">Total Transactions</h6>
                  <h2>{transactions.filter(t => t.status === "completed").length}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100 border-0">
                <Card.Body className="text-center">
                  <h6 className="text-muted mb-2">Average Transaction</h6>
                  <h2>
                    {transactions.filter(t => t.status === "completed").length > 0
                      ? `$${(totalRevenue / transactions.filter(t => t.status === "completed").length).toFixed(2)}`
                      : "$0.00"}
                  </h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Revenue Chart */}
          <div style={{ height: "300px" }}>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]} />
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
                <p>No revenue data available for the selected period</p>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Transactions List */}
      <Card className="shadow-sm mb-4">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
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
              <i className="bi bi-cash-coin text-muted" style={{ fontSize: "3rem" }}></i>
              <h4 className="mt-3">No Transactions Found</h4>
              <p className="text-muted mb-3">
                {searchQuery || filterStatus
                  ? "No transactions match your search or filter criteria."
                  : "No transactions have been made yet."}
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
                    <th>Event</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>
                        <Link to={`/admin/transactions/${transaction._id}`} className="text-decoration-none">
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
                        {transaction.user ? (
                          <Link to={`/admin/users/${transaction.user._id}`} className="text-decoration-none">
                            {transaction.user.name}
                          </Link>
                        ) : (
                          "Unknown"
                        )}
                      </td>
                      <td>
                        {transaction.event ? (
                          <Link to={`/admin/events/${transaction.event._id}`} className="text-decoration-none">
                            {transaction.event.title}
                          </Link>
                        ) : (
                          "Unknown Event"
                        )}
                      </td>
                      <td>${transaction.amount.toFixed(2)}</td>
                      <td>{getStatusBadge(transaction.status)}</td>
                      <td>
                        <div className="btn-group">
                          <Button
                            as={Link}
                            to={`/admin/transactions/${transaction._id}`}
                            variant="outline-primary"
                            size="sm"
                          >
                            Details
                          </Button>
                          {transaction.status !== "cancelled" && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleCancelTransaction(transaction._id)}
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
          )}
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default AdminTransactionsPage;