// src/components/layout/Navbar.js
import {
  Container,
  Navbar as BootstrapNavbar,
  Nav,
  NavDropdown,
  Spinner,
} from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";
import "./Navbar.css";

const Navbar = () => {
  const {
    currentUser,
    isAuthenticated,
    isAdmin,
    isOrganizer,
    logout,
    loading,
  } = useAuth();

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(() => {
      showToast("Logged out successfully", "success");
      navigate("/");
    });
  };

  return (
    <BootstrapNavbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="py-3 shadow"
    >
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold fs-4">
          Event<span className="brand-accent">Ease</span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle
          aria-controls="navbar-nav"
          className="border-0"
        />
        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" className="nav-link-item">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/events" className="nav-link-item">
              Events
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about" className="nav-link-item">
              About Us
            </Nav.Link>
            <Nav.Link as={NavLink} to="/faq" className="nav-link-item">
              FAQ
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact" className="nav-link-item">
              Contact
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto mobile-auth-nav">
            {loading ? (
              // Show spinner while loading authentication status
              <Spinner animation="border" variant="light" size="sm" />
            ) : isAuthenticated ? (
              <>
                {/* Display user-specific options */}
                <NavDropdown
                  title={
                    <span>
                      <i className="bi bi-person-circle me-1"></i>
                      {currentUser.name}
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  {/* Common user options */}
                  <NavDropdown.Item as={Link} to="/dashboard">
                    <i className="bi bi-speedometer2 me-2"></i>My Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/tickets">
                    <i className="bi bi-ticket-perforated me-2"></i>My Tickets
                  </NavDropdown.Item>
                  <NavDropdown.Divider />

                  {/* Organizer options */}
                  {(isOrganizer || isAdmin) && (
                    <>
                      <NavDropdown.Item as={Link} to="/organizer/dashboard">
                        <i className="bi bi-calendar-event me-2"></i>Organizer
                        Dashboard
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/organizer/events/create">
                        <i className="bi bi-plus-circle me-2"></i>Create Event
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </>
                  )}

                  {/* Admin options */}
                  {isAdmin && (
                    <>
                      <NavDropdown.Item as={Link} to="/admin/dashboard">
                        <i className="bi bi-gear me-2"></i>Admin Dashboard
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </>
                  )}

                  <NavDropdown.Item as={Link} to="/profile">
                    <i className="bi bi-person me-2"></i>My Profile
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <div className="d-flex auth-buttons">
                <Link
                  to="/login"
                  className="btn btn-outline-light me-lg-3 me-md-2"
                >
                  Login
                </Link>
                <Link to="/register" className="btn btn-info">
                  Sign Up
                </Link>
              </div>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;