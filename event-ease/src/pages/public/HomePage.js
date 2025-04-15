// src/pages/public/HomePage.js
import { useState, useEffect } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";
import EventCarousel from "../../components/home/EventCarousel";
import FeaturedEvents from "../../components/home/FeaturedEvents";
import TrendingEvents from "../../components/home/TrendingEvents";
import CategorySection from "../../components/home/CategorySection";
import CTASection from "../../components/home/CTASection";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import AlertMessage from "../../components/ui/AlertMessage";
import { eventService } from "../../services/eventService";

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [carouselEvents, setCarouselEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        // Fetch featured events
        const featuredEvents = await eventService.getFeaturedEvents();
        setFeaturedEvents(featuredEvents);

        // Set carousel events from the featured events
        setCarouselEvents(featuredEvents.slice(0, 5));

        // Fetch upcoming events for trending section
        const upcomingResponse = await eventService.getUpcomingEvents(6);
        setTrendingEvents(upcomingResponse.events);

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
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="home-page">
      {error && (
        <Container className="py-3">
          <AlertMessage variant="danger" message={error} />
        </Container>
      )}

      {/* Hero Carousel */}
      <EventCarousel events={carouselEvents} />

      {/* Featured Events Section */}
      <FeaturedEvents events={featuredEvents} loading={loading} error={error} />

      {/* Category Section */}
      <CategorySection />

      {/* Trending Events Section */}
      <TrendingEvents events={trendingEvents} />

      {/* First CTA - Register */}
      <CTASection
        type="register"
        title="Ready to join our community?"
        subtitle="Sign up today and start exploring events that match your interests. Find your next unforgettable experience with EventEase."
        buttonText="Register Now"
        buttonLink="/register"
        imageUrl="https://via.placeholder.com/600x400?text=Join+EventEase"
      />

      {/* Second CTA - Organize */}
      <CTASection
        type="organize"
        title="Got an event to share?"
        subtitle="Become an organizer and reach thousands of potential attendees. Creating and managing events on EventEase is simple and effective."
        buttonText="Start Organizing"
        buttonLink="/organizer/events/create"
        imageUrl="https://via.placeholder.com/600x400?text=Organize+Events"
      />
    </div>
  );
};

export default HomePage;
