import React from "react";
import { Row, Col } from "react-bootstrap";
import EventCard from "./EventCard";

const EventList = ({ events }) => {
  return (
    <Row>
      {events.map((event) => (
        <Col sm={12} md={6} lg={4} className="mb-4" key={event._id}>
          <EventCard event={event} />
        </Col>
      ))}
    </Row>
  );
};

export default EventList;
