// src/components/layout/AdminLayout.js
import React from "react";
import { Container, Row, Col, Nav, Card } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const { currentUser } = useAuth();

  // Check if current user is admin
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Container className="flex-grow-1 py-5">
          <Card className="p-5 text-center">
            <h3 className="mb-4">Access Denied</h3>
            <p className="mb-4">
              You don't have permission to access the admin area.
            </p>
            <div>
              <Link to="/" className="btn btn-primary">
                Go to Homepage
              </Link>
            </div>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Container fluid className="flex-grow-1 py-4">
        <Row>
          {/* Sidebar */}
          <Col lg={3} xl={2} className="mb-4">
            <Card>
              <Card.Header className="bg-dark text-white">
                <h5 className="mb-0">Admin Portal</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Nav className="flex-column">
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard"
                    active={location.pathname === "/admin/dashboard"}
                    className="border-bottom"
                  >
                    <i className="bi bi-speedometer2 me-2"></i> Dashboard
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/users"
                    active={location.pathname.startsWith("/admin/users")}
                    className="border-bottom"
                  >
                    <i className="bi bi-people me-2"></i> User Management
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/admin/events"
                    active={location.pathname.startsWith("/admin/events")}
                    className="border-bottom"
                  >
                    <i className="bi bi-calendar-event me-2"></i> Event
                    Management
                    {location.pathname.startsWith("/admin/events") && (
                      <div className="ms-4 mt-2">
                        <Nav.Link
                          as={Link}
                          to="/admin/events/featured"
                          active={
                            location.pathname === "/admin/events/featured"
                          }
                          className="small"
                        >
                          <i className="bi bi-star me-2"></i> Featured Events
                        </Nav.Link>
                      </div>
                    )}
                  </Nav.Link>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Main content */}
          <Col lg={9} xl={10}>
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLayout;