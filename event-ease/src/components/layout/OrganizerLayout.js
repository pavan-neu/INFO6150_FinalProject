// src/components/layout/OrganizerLayout.js
import React from "react";
import { Container, Row, Col, Nav, Spinner } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const OrganizerLayout = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  // Determine active link
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle null auth data gracefully
  if (!auth || !auth.currentUser) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading user data...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row>
        <Col lg={3} md={4} className="mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Organizer Dashboard</h5>
            </div>
            <div className="card-body p-0">
              <div className="p-3 border-bottom">
                <div className="d-flex align-items-center">
                  <div className="text-center me-3">
                    <i
                      className="bi bi-person-circle text-primary"
                      style={{ fontSize: "2rem" }}
                    ></i>
                  </div>
                  <div>
                    <h6 className="mb-0">{auth.currentUser?.name || "User"}</h6>
                    <small className="text-muted">
                      {auth.currentUser?.email || ""}
                    </small>
                  </div>
                </div>
              </div>
              <Nav className="flex-column">
                <Nav.Link
                  as={Link}
                  to="/organizer/dashboard"
                  className={`rounded-0 ${
                    isActive("/organizer/dashboard") ? "active bg-light" : ""
                  }`}
                >
                  <i className="bi bi-speedometer2 me-2"></i> Dashboard
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/organizer/events"
                  className={`rounded-0 ${
                    isActive("/organizer/events") ? "active bg-light" : ""
                  }`}
                >
                  <i className="bi bi-calendar-event me-2"></i> My Events
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/organizer/events/create"
                  className={`rounded-0 ${
                    isActive("/organizer/events/create")
                      ? "active bg-light"
                      : ""
                  }`}
                >
                  <i className="bi bi-plus-circle me-2"></i> Create Event
                </Nav.Link>
              </Nav>
            </div>
          </div>
        </Col>
        <Col lg={9} md={8}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default OrganizerLayout;