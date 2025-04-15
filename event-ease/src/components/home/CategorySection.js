// src/components/home/CategorySection.js
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./CategorySection.css";

const categories = [
  {
    id: "concert",
    name: "Concerts",
    icon: "bi-music-note-beamed",
    description: "Live music performances and shows",
    color: "#ff6b6b",
  },
  {
    id: "conference",
    name: "Conferences",
    icon: "bi-people-fill",
    description: "Industry events and professional gatherings",
    color: "#6a2ce8",
  },
  {
    id: "exhibition",
    name: "Exhibitions",
    icon: "bi-easel-fill",
    description: "Art displays and showcases",
    color: "#25dac5",
  },
  {
    id: "workshop",
    name: "Workshops",
    icon: "bi-tools",
    description: "Hands-on learning experiences",
    color: "#5f27cd",
  },
  {
    id: "sports",
    name: "Sports",
    icon: "bi-trophy-fill",
    description: "Sporting events and tournaments",
    color: "#feca57",
  },
  {
    id: "festival",
    name: "Festivals",
    icon: "bi-stars",
    description: "Cultural celebrations and festivities",
    color: "#54a0ff",
  },
  {
    id: "other",
    name: "Other Events",
    icon: "bi-calendar-event",
    description: "Unique and special events",
    color: "#8395a7",
  },
];

const CategorySection = () => {
  return (
    <section className="category-section py-5">
      <Container>
        <div className="section-header mb-4">
          <h2 className="section-title">Explore Categories</h2>
          <p className="section-subtitle">
            Find events that match your interests
          </p>
        </div>
        <Row>
          {categories.map((category) => (
            <Col key={category.id} lg={3} md={4} sm={6} className="mb-4">
              <Link
                to={`/events?category=${category.id}`}
                className="category-link"
              >
                <Card className="category-card h-100">
                  <Card.Body className="d-flex align-items-center">
                    <div
                      className="category-icon"
                      style={{ backgroundColor: category.color }}
                    >
                      <i className={`bi ${category.icon}`}></i>
                    </div>
                    <div className="category-info">
                      <h3 className="category-name">{category.name}</h3>
                      <p className="category-description">
                        {category.description}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default CategorySection;
