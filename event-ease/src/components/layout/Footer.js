// src/components/layout/Footer.js
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <h5>EventEase</h5>
            <p className="text-muted">
              The easiest way to discover and book events that match your
              interests.
            </p>
          </Col>

          <Col md={2} className="mb-3 mb-md-0">
            <h5>Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-muted">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted">
                  FAQ
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={3} className="mb-3 mb-md-0">
            <h5>Contact</h5>
            <ul className="list-unstyled">
              <li className="text-muted">Email: info@eventease.com</li>
              <li className="text-muted">Phone: +1 (123) 456-7890</li>
              <li>
                <Link to="/contact" className="text-muted">
                  Contact Form
                </Link>
              </li>
            </ul>
          </Col>

          <Col md={3}>
            <h5>Follow Us</h5>
            <div className="d-flex gap-2">
              <a href="#" className="text-white">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
              <a href="#" className="text-white">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#" className="text-white">
                <i className="fab fa-instagram fa-lg"></i>
              </a>
              <a href="#" className="text-white">
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
            </div>
          </Col>
        </Row>

        <hr className="my-3 bg-secondary" />

        <Row>
          <Col className="text-center">
            <p className="mb-0 text-muted">
              &copy; {currentYear} EventEase. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
