// src/components/home/EventCarousel.js
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./EventCarousel.css";

const EventCarousel = ({ events }) => {
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <Carousel className="event-carousel">
      {events.map((event) => (
        <Carousel.Item key={event._id}>
          <div
            className="carousel-image"
            style={{
              backgroundImage: `url(${
                event.imageUrl ||
                "https://via.placeholder.com/1200x500?text=EventEase"
              })`,
            }}
          >
            <div className="carousel-overlay"></div>
          </div>
          <Carousel.Caption className="carousel-caption">
            <div className="caption-content">
              <span className="event-category">{event.category}</span>
              <h2>{event.title}</h2>
              <p className="event-date">
                <i className="bi bi-calendar-event"></i>{" "}
                {new Date(event.startDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="event-location">
                <i className="bi bi-geo-alt"></i>{" "}
                {event.location?.venue || "Online"}
                {event.location?.city && `, ${event.location.city}`}
              </p>
              <Link
                to={`/events/${event._id}`}
                className="btn btn-primary btn-lg"
              >
                View Details
              </Link>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default EventCarousel;
