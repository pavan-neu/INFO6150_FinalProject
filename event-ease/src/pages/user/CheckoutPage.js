// src/pages/user/CheckoutPage.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import AlertMessage from "../../components/ui/AlertMessage";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Initialize state variables first - ALWAYS before any conditional returns
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reservationTimer, setReservationTimer] = useState(600); // 10 minutes in seconds
  const [ticketData, setTicketData] = useState(null);
  
  // Use useEffect to handle redirection if no ticket data
  useEffect(() => {
    if (!location.state || !location.state.tickets) {
      navigate('/events');
    } else {
      setTicketData(location.state);
    }
  }, [location.state, navigate]);
  
  // Countdown timer for reservation - only runs if ticketData exists
  useEffect(() => {
    if (!ticketData) return;
    
    if (reservationTimer <= 0) {
      navigate('/events');
      return;
    }
    
    const timerId = setTimeout(() => {
      setReservationTimer(reservationTimer - 1);
    }, 1000);
    
    return () => clearTimeout(timerId);
  }, [reservationTimer, navigate, ticketData]);
  
  // Format time remaining
  const formatTimeRemaining = () => {
    const minutes = Math.floor(reservationTimer / 60);
    const seconds = reservationTimer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Show loading spinner while waiting for data or redirecting
  if (!ticketData) {
    return <LoadingSpinner />;
  }
  
  // Destructure ticket data after we know it exists
  const { tickets, event, totalPrice, quantity } = ticketData;
  
  return (
    <Container className="py-5">
      <h2 className="mb-4">Complete Your Purchase</h2>
      
      <Alert variant="warning" className="d-flex align-items-center">
        <i className="bi bi-clock me-2"></i> 
        Time remaining to complete purchase: <span className="ms-2 fw-bold">{formatTimeRemaining()}</span>
      </Alert>
      
      <Row className="mt-4">
        <Col lg={7}>
          <Card className="mb-4">
            <Card.Header>
              <h4 className="mb-0">Order Summary</h4>
            </Card.Header>
            <Card.Body>
              <div className="d-flex mb-4">
                <div className="event-image-small me-3">
                  <img 
                    src={event.imageUrl.startsWith("http") ? event.imageUrl : `/uploads/events/${event.imageUrl}`}
                    alt={event.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/event-placeholder.png";
                    }}
                    className="img-fluid rounded"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                </div>
                <div>
                  <h5>{event.title}</h5>
                  <p className="text-muted mb-1">
                    <i className="bi bi-calendar me-2"></i>
                    {formatDate(event.startDate)}, {event.startTime}
                  </p>
                  <p className="text-muted mb-0">
                    <i className="bi bi-geo-alt me-2"></i>
                    {event.location.venue}
                  </p>
                </div>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-2">
                <span>Tickets</span>
                <span>{quantity}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Price per ticket</span>
                <span>${event.ticketPrice.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Total</span>
                <span className="fw-bold fs-4">${totalPrice.toFixed(2)}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={5}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Payment Details</h4>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-4">
                This section will be implemented in Task 17 (Payment Integration)
              </p>
              
              <div className="bg-light p-4 rounded text-center mb-3">
                <p className="mb-3">For now, we'll simulate a successful payment.</p>
                <Button 
                  variant="success" 
                  size="lg" 
                  className="w-100"
                  onClick={() => navigate('/tickets')}
                >
                  Complete Purchase (Simulation)
                </Button>
              </div>
              
              <div className="text-center mt-3">
                <Link to="/events" className="btn btn-outline-secondary">
                  Cancel and Return to Events
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;