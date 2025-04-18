// src/components/layout/Footer.js
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container className="text-center">
        <Row className="justify-content-center">
          <Col md={5} className="mb-3">
            <h5 className="mb-3">
              <Link to="/" className="text-white text-decoration-none">
                Event<span className="brand-accent">Ease</span>
              </Link>
            </h5>
            <p className="text-white">
              The easiest way to discover and book events that match your
              interests.
            </p>
          </Col>

          <Col md={5} className="mb-3">
            <h5 className="mb-3">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a
                  href="mailto:support@eventease.com"
                  className="text-white text-decoration-none"
                >
                  <i className="bi bi-envelope me-2"></i>support@eventease.com
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="tel:+11234567890"
                  className="text-white text-decoration-none"
                >
                  <i className="bi bi-telephone me-2"></i>+1 (123) 456-7890
                </a>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-white text-decoration-none">
                  <i className="bi bi-geo-alt me-2"></i>123 Event Street, San
                  Francisco, CA 94103
                </Link>
              </li>
            </ul>
          </Col>
        </Row>

        <div className="social-links d-flex justify-content-center gap-4 my-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white social-icon"
          >
            <i className="bi bi-facebook"></i>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white social-icon"
          >
            <i className="bi bi-twitter"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white social-icon"
          >
            <i className="bi bi-instagram"></i>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white social-icon"
          >
            <i className="bi bi-linkedin"></i>
          </a>
        </div>

        <hr className="my-3 bg-secondary" />

        <p className="text-white mb-0">
          &copy; {currentYear} EventEase. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;