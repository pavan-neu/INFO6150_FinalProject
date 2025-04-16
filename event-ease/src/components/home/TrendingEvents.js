// src/components/home/TrendingEvents.js
import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import EventCard from "../events/EventCard";
import EmptyState from "./EmptyState";
import "./TrendingEvents.css";

const TrendingEvents = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <section className="trending-events-section py-5">
        <Container>
          <div className="section-header mb-4">
            <h2 className="section-title">Trending Now</h2>
            <p className="section-subtitle">
              Explore the most popular events this week
            </p>
          </div>
          <EmptyState
            title="No Trending Events"
            message="Check back soon for the hottest upcoming events in your area!"
            buttonText="Explore Categories"
            buttonLink="/events"
            icon="bi-graph-up"
          />
        </Container>
      </section>
    );
  }

  return (
    <section className="trending-events-section py-5">
      <Container>
        <div className="section-header mb-4">
          <h2 className="section-title">Trending Now</h2>
          <p className="section-subtitle">
            Explore the most popular events this week
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
          <Link
            to="/events?sort=popular"
            className="btn btn-outline-primary btn-lg"
          >
            See More Trending Events
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default TrendingEvents;
