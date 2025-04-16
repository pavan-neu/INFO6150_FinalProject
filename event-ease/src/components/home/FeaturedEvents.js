// src/components/home/FeaturedEvents.js
import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import EventCard from "../events/EventCard";
import LoadingSpinner from "../ui/LoadingSpinner";
import EmptyState from "./EmptyState";
import "./FeaturedEvents.css";

const FeaturedEvents = ({ events, loading, error }) => {
  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <section className="featured-events-section py-5">
        <Container>
          <div className="section-header mb-4">
            <h2 className="section-title">Featured Events</h2>
            <p className="section-subtitle">
              Discover our handpicked selection of exceptional events
            </p>
          </div>
          <EmptyState
            title="No Featured Events"
            message="Stay tuned! We're working on bringing you some amazing featured events soon."
            buttonText="Browse All Events"
            icon="bi-stars"
          />
        </Container>
      </section>
    );
  }

  return (
    <section className="featured-events-section py-5">
      <Container>
        <div className="section-header mb-4">
          <h2 className="section-title">Featured Events</h2>
          <p className="section-subtitle">
            Discover our handpicked selection of exceptional events
          </p>
        </div>
        <Row>
          {events.map((event) => (
            <Col key={event._id} lg={4} md={6} className="mb-4">
              <EventCard event={event} />
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Link to="/events" className="btn btn-outline-primary btn-lg">
            View All Events
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedEvents;
