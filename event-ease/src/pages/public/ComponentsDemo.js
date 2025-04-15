// src/pages/public/ComponentsDemo.js
import { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  LoadingSpinner,
  AlertMessage,
  Pagination,
  EventCard,
  FormInput,
  FormSelect,
  FormTextarea,
  FormCheckbox,
} from "../../components";

const ComponentsDemo = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
    subscribe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Sample event data
  const sampleEvent = {
    _id: "123",
    title: "Tech Conference 2025",
    imageUrl: "https://via.placeholder.com/300x200",
    category: "Conference",
    startDate: "2025-06-15",
    startTime: "09:00",
    location: {
      venue: "Tech Center",
      city: "Boston",
    },
    ticketPrice: 99.99,
    ticketsRemaining: 45,
    totalTickets: 200,
    isFeatured: true,
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Component Library</h1>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>Loading Spinner</Card.Header>
            <Card.Body>
              <h5>Default Spinner</h5>
              <LoadingSpinner />

              <h5 className="mt-3">Different Variants</h5>
              <div className="d-flex gap-3">
                <LoadingSpinner variant="success" text="Loading Success" />
                <LoadingSpinner variant="danger" text="Loading Error" />
                <LoadingSpinner variant="warning" text="Loading Warning" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>Alert Messages</Card.Header>
            <Card.Body>
              <h5>Different Variants</h5>
              <AlertMessage
                variant="success"
                message="Operation completed successfully!"
              />
              <AlertMessage
                variant="danger"
                message="An error occurred while processing your request."
              />
              <AlertMessage
                variant="warning"
                message="Please note this is a warning message."
              />
              <AlertMessage
                variant="info"
                message="Here's some information you might find useful."
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12} className="mb-4">
          <Card>
            <Card.Header>Pagination</Card.Header>
            <Card.Body>
              <p>Current Page: {currentPage}</p>
              <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="mb-4">
          <h5>Event Card</h5>
          <EventCard event={sampleEvent} />
        </Col>

        <Col md={8} className="mb-4">
          <Card>
            <Card.Header>Form Components</Card.Header>
            <Card.Body>
              <FormInput
                label="Name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />

              <FormInput
                label="Email"
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="Enter your email"
                helpText="We'll never share your email with anyone else."
                required
              />

              <FormSelect
                label="Category"
                name="category"
                value={formValues.category}
                onChange={handleChange}
                options={[
                  { value: "", label: "Select a category" },
                  { value: "conference", label: "Conference" },
                  { value: "workshop", label: "Workshop" },
                  { value: "concert", label: "Concert" },
                  { value: "sports", label: "Sports Event" },
                ]}
                required
              />

              <FormTextarea
                label="Message"
                name="message"
                value={formValues.message}
                onChange={handleChange}
                placeholder="Enter your message"
                rows={4}
              />

              <FormCheckbox
                label="Subscribe to newsletter"
                name="subscribe"
                checked={formValues.subscribe}
                onChange={handleChange}
              />

              <Button variant="primary" className="mt-3">
                Submit Form
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ComponentsDemo;
