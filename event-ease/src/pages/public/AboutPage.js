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
              e.target.src =
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
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

        {/* First row of team members */}
        <Row className="justify-content-center mb-4">
          <Col lg={4} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center p-4">
                <h3 className="h5 mb-2">Pavan Garlapati</h3>
                <p className="text-muted mb-0">Full Stack Developer</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center p-4">
                <h3 className="h5 mb-2">Navya Ravuri</h3>
                <p className="text-muted mb-0">Full Stack Developer</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center p-4">
                <h3 className="h5 mb-2">Dikshith Pulakanti</h3>
                <p className="text-muted mb-0">Frontend Developer</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Second row of team members */}
        <Row className="justify-content-center">
          <Col lg={4} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center p-4">
                <h3 className="h5 mb-2">Praneeth Reddy</h3>
                <p className="text-muted mb-0">Frontend Developer</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center p-4">
                <h3 className="h5 mb-2">Aravind Sundaravadivelu</h3>
                <p className="text-muted mb-0">Backend Developer</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
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