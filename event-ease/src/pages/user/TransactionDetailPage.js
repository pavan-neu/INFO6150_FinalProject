// src/pages/user/TransactionDetailPage.js
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Badge,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { getTransactionById } from "../../services/transactionService";

const TransactionDetailPage = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch transaction details
  const fetchTransactionDetails = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTransactionById(transactionId);
      setTransaction(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load transaction details. Please try again.");
      setLoading(false);
    }
  }, [transactionId]);

  // Load transaction on component mount
  useEffect(() => {
    fetchTransactionDetails();
  }, [fetchTransactionDetails]);

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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading transaction details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={fetchTransactionDetails} variant="primary">
          Try Again
        </Button>
      </Container>
    );
  }

  if (!transaction) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Transaction not found</Alert>
        <Link to="/transactions" className="btn btn-primary">
          Back to Transactions
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Link to="/transactions" className="btn btn-outline-secondary mb-4">
        ← Back to My Transactions
      </Link>

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Transaction Details</h4>
                {getStatusBadge(transaction.status)}
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col sm={4} className="mb-3">
                  <h6 className="text-muted">Transaction ID</h6>
                  <p className="mb-0 text-break">{transaction._id}</p>
                </Col>
                <Col sm={4} className="mb-3">
                  <h6 className="text-muted">Date</h6>
                  <p className="mb-0">{formatDate(transaction.createdAt)}</p>
                </Col>
                <Col sm={4} className="mb-3">
                  <h6 className="text-muted">Amount</h6>
                  <p className="mb-0 fw-bold">
                    ${transaction.amount.toFixed(2)}
                  </p>
                </Col>
              </Row>

              <Row>
                <Col sm={4} className="mb-3">
                  <h6 className="text-muted">Payment Method</h6>
                  <p className="mb-0 text-capitalize">
                    {transaction.paymentMethod}
                  </p>
                </Col>
                <Col sm={4} className="mb-3">
                  <h6 className="text-muted">Payment ID</h6>
                  <p className="mb-0 text-break">
                    {transaction.paymentId || "N/A"}
                  </p>
                </Col>
                <Col sm={4} className="mb-3">
                  <h6 className="text-muted">Status</h6>
                  <p className="mb-0">{getStatusBadge(transaction.status)}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {transaction.event && (
            <Card className="shadow-sm mb-4">
              <Card.Header>
                <h5 className="mb-0">Event Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col sm={6} className="mb-3">
                    <h6 className="text-muted">Event Name</h6>
                    <p className="mb-0">
                      <Link to={`/events/${transaction.event._id}`}>
                        {transaction.event.title}
                      </Link>
                    </p>
                  </Col>
                  <Col sm={6} className="mb-3">
                    <h6 className="text-muted">Event Date</h6>
                    <p className="mb-0">
                      {new Date(
                        transaction.event.startDate
                      ).toLocaleDateString()}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {transaction.ticket && (
            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">Ticket Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col sm={6} className="mb-3">
                    <h6 className="text-muted">Ticket Number</h6>
                    <p className="mb-0">{transaction.ticket.ticketNumber}</p>
                  </Col>
                  <Col sm={6} className="mb-3">
                    <h6 className="text-muted">Ticket Status</h6>
                    <p className="mb-0 text-capitalize">
                      {transaction.ticket.status}
                    </p>
                  </Col>
                </Row>

                <Link
                  to={`/tickets/${transaction.ticket._id}`}
                  className="btn btn-outline-primary"
                >
                  View Ticket
                </Link>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <h5 className="mb-0">Payment Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span>Ticket Price:</span>
                <span>${transaction.amount.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Processing Fee:</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>${transaction.amount.toFixed(2)}</span>
              </div>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-4">
            <Card.Header>
              <h5 className="mb-0">Need Help?</h5>
            </Card.Header>
            <Card.Body>
              <p>
                If you have any questions or issues with this transaction,
                please contact our support team.
              </p>
              <Link to="/contact" className="btn btn-outline-primary w-100">
                Contact Support
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TransactionDetailPage;
