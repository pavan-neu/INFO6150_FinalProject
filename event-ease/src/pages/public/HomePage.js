// src/pages/public/HomePage.js
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import EventCarousel from "../../components/home/EventCarousel";
import FeaturedEvents from "../../components/home/FeaturedEvents";
import TrendingEvents from "../../components/home/TrendingEvents";
import CategorySection from "../../components/home/CategorySection";
import CTASection from "../../components/home/CTASection";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import AlertMessage from "../../components/ui/AlertMessage";
import * as eventService from "../../services/eventService";
import useAuth from "../../hooks/useAuth";

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [carouselEvents, setCarouselEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch featured events
        const featured = await eventService.getFeaturedEvents();
        setFeaturedEvents(featured || []);

        // Set carousel events from the featured events (choose top 5)
        const carouselData =
          featured?.length > 0
            ? featured.slice(0, Math.min(5, featured.length))
            : [];
        setCarouselEvents(carouselData);

        // Fetch upcoming events for trending section
        const upcoming = await eventService.getUpcomingEvents(1, 6);
        setTrendingEvents(upcoming?.events || []);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage text="Loading amazing events for you..." />;
  }

  return (
    <div className="home-page">
      {error && (
        <Container className="py-3">
          <AlertMessage variant="danger" message={error} />
        </Container>
      )}

      {/* Hero Carousel */}
      {carouselEvents.length > 0 ? (
        <EventCarousel events={carouselEvents} />
      ) : (
        <div className="placeholder-carousel py-5 bg-dark text-white text-center">
          <Container>
            <h1 className="display-4">Discover Amazing Events</h1>
            <p className="lead">
              Find and book tickets for the best events near you
            </p>
          </Container>
        </div>
      )}

      {/* Featured Events Section */}
      <FeaturedEvents events={featuredEvents} loading={false} error={null} />

      {/* Category Section */}
      <CategorySection />

      {/* Trending Events Section */}
      <TrendingEvents events={trendingEvents} />

      {/* CTA Sections - Show different CTAs based on auth status */}
      {!isAuthenticated ? (
        <CTASection
          type="register"
          title="Ready to join our community?"
          subtitle="Sign up today and start exploring events that match your interests. Find your next unforgettable experience with EventEase."
          buttonText="Register Now"
          buttonLink="/register"
          imageUrl="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
        />
      ) : (
        <CTASection
          type="register"
          title="Discover New Events"
          subtitle="Explore and book tickets for upcoming events that match your interests. We've curated amazing experiences just for you."
          buttonText="Browse Events"
          buttonLink="/events"
          imageUrl="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
        />
      )}

      {/* Organizer CTA */}
      <CTASection
        type="organize"
        title="Got an event to share?"
        subtitle="Become an organizer and reach thousands of potential attendees. Creating and managing events on EventEase is simple and effective."
        buttonText="Start Organizing"
        buttonLink="/organizer/events/create"
        imageUrl="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
      />
    </div>
  );
};

export default HomePage;