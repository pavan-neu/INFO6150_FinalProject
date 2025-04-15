// src/components/layout/Navbar.js
import { Container, Navbar as BootstrapNavbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LogoutButton from './LogoutButton';

const Navbar = () => {
  const { currentUser, isAuthenticated, isAdmin, isOrganizer } = useAuth();

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="py-3 shadow">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold fs-4">
          Event<span className="text-info">Ease</span>
        </BootstrapNavbar.Brand>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" className="mx-1">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/events" className="mx-1">Events</Nav.Link>
            <Nav.Link as={NavLink} to="/about" className="mx-1">About Us</Nav.Link>
            <Nav.Link as={NavLink} to="/faq" className="mx-1">FAQ</Nav.Link>
            <Nav.Link as={NavLink} to="/contact" className="mx-1">Contact</Nav.Link>
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
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
                        <i className="bi bi-calendar-event me-2"></i>Organizer Dashboard
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
                </NavDropdown>
                
                <LogoutButton />
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="btn btn-outline-light me-2">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="btn btn-info">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;