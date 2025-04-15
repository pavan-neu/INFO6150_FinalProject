// src/pages/auth/UnauthorizedPage.js
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Alert variant="danger" className="text-center">
            <Alert.Heading>Access Denied</Alert.Heading>
            <p>
              You don't have permission to access this page. This area requires
              different user privileges.
            </p>
            <div className="d-flex justify-content-center">
              <Button as={Link} to="/" variant="outline-danger">
                Return to Home
              </Button>
            </div>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default UnauthorizedPage;