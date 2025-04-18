// src/components/home/CTASection.js
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./CTASection.css";

const CTASection = ({
  type = "register",
  title,
  subtitle,
  buttonText,
  buttonLink,
  imageUrl,
}) => {
  return (
    <section className={`cta-section cta-${type} py-5`}>
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="cta-content">
              <h2 className="cta-title">{title}</h2>
              <p className="cta-subtitle">{subtitle}</p>
              <Link to={buttonLink}>
                <Button
                  variant={type === "register" ? "primary" : "outline-light"}
                  size="lg"
                  className="cta-button"
                >
                  {buttonText}
                </Button>
              </Link>
            </div>
          </Col>
          <Col lg={6}>
            <div className="cta-image-container">
              <img
                src={
                  imageUrl || "https://placehold.co/600x400?text=Call to Action"
                }
                alt="Call to action"
                className="cta-image img-fluid"
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CTASection;