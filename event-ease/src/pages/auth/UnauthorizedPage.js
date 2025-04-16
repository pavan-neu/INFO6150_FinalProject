// src/pages/auth/UnauthorizedPage.js
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="border-danger">
            <Card.Body className="text-center">
              <i
                className="bi bi-shield-exclamation text-danger"
                style={{ fontSize: "4rem" }}
              ></i>
              <Card.Title as="h2" className="mt-3">
                Access Denied
              </Card.Title>
              <Card.Text className="mb-4">
                You don't have permission to access this page. This area
                requires different user privileges.
              </Card.Text>
              <div className="d-flex justify-content-center gap-2">
                <Button as={Link} to="/" variant="primary">
                  Return to Home
                </Button>
                <Button as={Link} to="/contact" variant="outline-secondary">
                  Contact Support
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UnauthorizedPage;
