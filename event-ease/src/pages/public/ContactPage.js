import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import AlertMessage from "../../components/ui/AlertMessage";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [validated, setValidated] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Form validation
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setIsSubmitting(true);

    // Simulate form submission
    try {
      // In a real app, you'd make an API call here
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitStatus({
        type: "success",
        message: "Your message has been sent! We will get back to you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setValidated(false);
    } catch (error) {
      setSubmitStatus({
        type: "danger",
        message: "Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={12} className="text-center">
          <h1 className="display-4 mb-4">Contact Us</h1>
          <p className="lead">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </Col>
      </Row>

      <Row>
        <Col lg={5} className="mb-4 mb-lg-0">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="p-4">
              <h2 className="h4 mb-4">Get in Touch</h2>

              <div className="mb-4">
                <h3 className="h5 mb-2">
                  <i className="fa fa-map-marker-alt me-2 text-primary"></i>
                  Visit Us
                </h3>
                <p className="mb-0">
                  123 Event Street
                  <br />
                  Suite 456
                  <br />
                  San Francisco, CA 94105
                </p>
              </div>

              <div className="mb-4">
                <h3 className="h5 mb-2">
                  <i className="fa fa-envelope me-2 text-primary"></i>
                  Email Us
                </h3>
                <p className="mb-0">
                  <a
                    href="mailto:info@eventease.com"
                    className="text-decoration-none"
                  >
                    info@eventease.com
                  </a>
                </p>
                <p className="mb-0">
                  <a
                    href="mailto:support@eventease.com"
                    className="text-decoration-none"
                  >
                    support@eventease.com
                  </a>
                </p>
              </div>

              <div className="mb-4">
                <h3 className="h5 mb-2">
                  <i className="fa fa-phone me-2 text-primary"></i>
                  Call Us
                </h3>
                <p className="mb-0">
                  <a href="tel:+14155552671" className="text-decoration-none">
                    +1 (415) 555-2671
                  </a>
                </p>
              </div>

              <div>
                <h3 className="h5 mb-3">
                  <i className="fa fa-clock me-2 text-primary"></i>
                  Hours
                </h3>
                <p className="mb-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="mb-0">Saturday: 10:00 AM - 2:00 PM</p>
                <p className="mb-0">Sunday: Closed</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h2 className="h4 mb-4">Send Us a Message</h2>

              {submitStatus.message && (
                <AlertMessage
                  variant={submitStatus.type}
                  dismissible={true}
                  onClose={() => setSubmitStatus({ type: "", message: "" })}
                >
                  {submitStatus.message}
                </AlertMessage>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="name">
                      <Form.Label>Your Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide your name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group controlId="email">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid email address.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="subject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    name="subject"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a subject.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="message">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    rows={6}
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a message.
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col lg={12}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-0">
              <div style={{ height: "400px", width: "100%" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.1134393636594!2d-122.39633492392163!3d37.78990241639712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858062c0f0dd65%3A0x72b97aa84f05699f!2sTransamerica%20Pyramid!5e0!3m2!1sen!2sus!4v1683034170849!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="EventEase Office Location"
                ></iframe>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPage;
