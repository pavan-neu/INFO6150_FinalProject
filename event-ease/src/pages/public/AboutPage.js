import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

const AboutPage = () => {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col lg={12} className="text-center">
          <h1 className="display-4 mb-4">About EventEase</h1>
          <p className="lead mb-4">
            Connecting people through memorable experiences since 2023
          </p>
          <hr className="my-4" />
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={6} className="mb-4 mb-lg-0">
          <img
            src="/images/about-hero.jpg"
            alt="EventEase Team"
            className="img-fluid rounded shadow-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x400?text=EventEase";
            }}
          />
        </Col>
        <Col lg={6}>
          <h2 className="mb-4">Our Story</h2>
          <p>
            EventEase was founded with a simple mission: to make event discovery
            and booking seamless for everyone. What started as a small project
            between friends has grown into a platform connecting thousands of
            event organizers with attendees.
          </p>
          <p>
            We believe that great experiences bring people together, and we're
            passionate about helping you discover events that match your
            interests, whether they're concerts, workshops, conferences, or
            community gatherings.
          </p>
          <p>
            Our team combines expertise in technology, event management, and
            customer service to create a platform that serves both event
            organizers and attendees with a user-friendly and reliable
            experience.
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={12}>
          <h2 className="text-center mb-4">Our Values</h2>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="mb-3">
                <i className="fa fa-heart fa-3x text-primary"></i>
              </div>
              <h3 className="h4">Community First</h3>
              <p className="mb-0">
                We build technology that strengthens connections and creates
                shared experiences.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="mb-3">
                <i className="fa fa-shield-alt fa-3x text-primary"></i>
              </div>
              <h3 className="h4">Trust & Safety</h3>
              <p className="mb-0">
                We ensure secure transactions and protect your personal
                information.
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center p-4">
              <div className="mb-3">
                <i className="fa fa-unlock-alt fa-3x text-primary"></i>
              </div>
              <h3 className="h4">Accessibility</h3>
              <p className="mb-0">
                We design an inclusive platform where everyone can discover
                events they love.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={12}>
          <h2 className="text-center mb-4">Our Team</h2>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Img
              variant="top"
              src="https://placehold.co/300x300?text=CEO"
              alt="CEO"
            />
            <Card.Body className="text-center">
              <h3 className="h5">Sarah Johnson</h3>
              <p className="text-muted">CEO & Co-founder</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Img
              variant="top"
              src="https://placehold.co/300x300?text=CTO"
              alt="CTO"
            />
            <Card.Body className="text-center">
              <h3 className="h5">Michael Chen</h3>
              <p className="text-muted">CTO & Co-founder</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Img
              variant="top"
              src="https://placehold.co/300x300?text=Design"
              alt="Design Lead"
            />
            <Card.Body className="text-center">
              <h3 className="h5">Olivia Smith</h3>
              <p className="text-muted">Design Lead</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Img
              variant="top"
              src="https://placehold.co/300x300?text=Marketing"
              alt="Marketing Director"
            />
            <Card.Body className="text-center">
              <h3 className="h5">David Park</h3>
              <p className="text-muted">Marketing Director</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12} className="text-center">
          <h2 className="mb-4">Join Our Journey</h2>
          <p className="lead">
            Whether you're an event organizer looking to reach new audiences or
            an attendee searching for your next memorable experience, we're here
            to help.
          </p>
          <a href="/contact" className="btn btn-primary btn-lg mt-3">
            Get in Touch
          </a>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;
