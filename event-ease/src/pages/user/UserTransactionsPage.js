// src/pages/user/UserTransactionsPage.js
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Card,
  Table,
  Badge,
  Spinner,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { getUserTransactions } from "../../services/transactionService";
import Pagination from "../../components/ui/Pagination";

const UserTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSpent, setTotalSpent] = useState(0);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUserTransactions(page, 10);
      setTransactions(data.transactions);
      setTotalPages(data.pages);

      // If we're on the first page, get the total from the response
      if (page === 1 && data.totalRevenue) {
        setTotalSpent(data.totalRevenue);
      } else if (page === 1) {
        // Calculate total from completed transactions if not provided
        const completedTransactions = data.transactions.filter(
          (transaction) => transaction.status === "completed"
        );
        const total = completedTransactions.reduce(
          (sum, transaction) => sum + transaction.amount,
          0
        );
        setTotalSpent(total);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load transactions. Please try again.");
      setLoading(false);
    }
  }, [page]);

  // Load transactions on component mount and when page changes
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge bg="success">Completed</Badge>;
      case "pending":
        return (
          <Badge bg="warning" text="dark">
            Pending
          </Badge>
        );
      case "failed":
        return <Badge bg="danger">Failed</Badge>;
      case "refunded":
        return <Badge bg="info">Refunded</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">My Transactions</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={6} lg={4}>
          <Card className="bg-light shadow-sm h-100">
            <Card.Body className="text-center p-4">
              <h5 className="text-muted mb-3">Total Spent</h5>
              <h2 className="mb-0">${totalSpent.toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading your transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-4">
              <i
                className="bi bi-cash-coin text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h4 className="mt-3">No Transactions Found</h4>
              <p className="text-muted">
                You haven't made any transactions yet.
              </p>
              <Link to="/events" className="btn btn-primary mt-2">
                Browse Events
              </Link>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td>
                          {transaction.event ? (
                            <Link to={`/events/${transaction.event._id}`}>
                              {transaction.event.title}
                            </Link>
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </td>
                        <td>{formatDate(transaction.createdAt)}</td>
                        <td>${transaction.amount.toFixed(2)}</td>
                        <td className="text-capitalize">
                          {transaction.paymentMethod}
                        </td>
                        <td>{getStatusBadge(transaction.status)}</td>
                        <td>
                          <Link
                            to={`/transactions/${transaction._id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserTransactionsPage;
