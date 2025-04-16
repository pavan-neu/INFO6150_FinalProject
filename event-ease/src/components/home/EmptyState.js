// src/components/home/EmptyState.js
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./EmptyState.css";

const EmptyState = ({
  title = "No Events Found",
  message = "There are no events available at the moment.",
  buttonText = "Browse All Events",
  buttonLink = "/events",
  icon = "bi-calendar-x",
}) => {
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="empty-state p-4">
            <i className={`bi ${icon} empty-icon`}></i>
            <h3 className="mt-3">{title}</h3>
            <p className="text-muted mb-4">{message}</p>
            <Link to={buttonLink}>
              <Button variant="primary">{buttonText}</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EmptyState;
