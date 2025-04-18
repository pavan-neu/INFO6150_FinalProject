import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { getEvents } from "../../services/eventService";
import EventList from "../../components/events/EventList";
import EventFilter from "../../components/events/EventFilter";
import EventSearchBar from "../../components/events/EventSearchBar";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import AlertMessage from "../../components/ui/AlertMessage";
import Pagination from "../../components/ui/Pagination";

// Add custom CSS for filter container
const filterContainerStyles = `
  .filter-container {
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    background-color: white;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .filter-content {
    overflow-x: auto;
    overflow-y: visible;
    padding-bottom: 12px; /* Space for the scrollbar */
  }
  
  .filter-content::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  
  .filter-content::-webkit-scrollbar-thumb {
    background-color: rgba(0,0,0,0.2);
    border-radius: 4px;
  }
  
  .filter-content::-webkit-scrollbar-track {
    background-color: rgba(0,0,0,0.05);
  }
  
  @media (max-width: 768px) {
    .filter-container {
      max-height: 50vh;
      margin-bottom: 20px;
    }
    
    .filter-content {
      min-width: max-content;
    }
  }
`;

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  // eslint-disable-next-line no-unused-vars
  const [isSearching, setIsSearching] = useState(false);
  const [hasNoSearchResults, setHasNoSearchResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 6; // Events per page

  // Fetch events with filters
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setHasNoSearchResults(false);

      // Prepare params
      const params = {
        page,
        limit,
      };

      // Add category to params if it's selected
      if (category) {
        params.category = category;
      }

      // If there's a search query, use search endpoint
      let data;
      if (searchQuery.trim()) {
        setIsSearching(true);
        const { searchEvents } = require("../../services/eventService");
        data = await searchEvents(searchQuery, page, limit, category);
      } else {
        setIsSearching(false);
        data = await getEvents(params);
      }

      // Apply client-side filtering for price range and date range
      let filteredEvents = data.events;

      // Filter by price range
      if (priceRange.min !== null || priceRange.max !== null) {
        filteredEvents = filteredEvents.filter((event) => {
          const price = event.ticketPrice;
          if (priceRange.min !== null && priceRange.max !== null) {
            return price >= priceRange.min && price <= priceRange.max;
          } else if (priceRange.min !== null) {
            return price >= priceRange.min;
          } else if (priceRange.max !== null) {
            return price <= priceRange.max;
          }
          return true;
        });
      }

      // Filter by date range
      if (dateRange.start || dateRange.end) {
        filteredEvents = filteredEvents.filter((event) => {
          const eventStartDate = new Date(event.startDate);

          if (dateRange.start && dateRange.end) {
            const startFilter = new Date(dateRange.start);
            const endFilter = new Date(dateRange.end);
            // Set end date to end of day for inclusive filtering
            endFilter.setHours(23, 59, 59, 999);
            return eventStartDate >= startFilter && eventStartDate <= endFilter;
          } else if (dateRange.start) {
            const startFilter = new Date(dateRange.start);
            return eventStartDate >= startFilter;
          } else if (dateRange.end) {
            const endFilter = new Date(dateRange.end);
            // Set end date to end of day for inclusive filtering
            endFilter.setHours(23, 59, 59, 999);
            return eventStartDate <= endFilter;
          }
          return true;
        });
      }

      // Check for no search results
      if (searchQuery.trim() && filteredEvents.length === 0) {
        setHasNoSearchResults(true);
      } else {
        setHasNoSearchResults(false);
      }

      // Update with filtered events
      setEvents(filteredEvents);

      // If we're filtering on the client side, we need to update pagination info
      if (
        priceRange.min !== null ||
        priceRange.max !== null ||
        dateRange.start ||
        dateRange.end
      ) {
        setTotal(filteredEvents.length);
        setPages(Math.ceil(filteredEvents.length / limit));
      } else {
        // Otherwise use server pagination info
        setPage(data.page);
        setPages(data.pages);
        setTotal(data.total);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load events. Please try again later.");
      setLoading(false);
      console.error("Error fetching events:", err);
    }
  }, [category, dateRange, limit, page, priceRange, searchQuery]);

  // Load events when page or filters change
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, page, category, priceRange, dateRange]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when searching
  };

  // Handle category filter
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1); // Reset to first page when changing category
  };

  // Handle price range filter
  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
    setPage(1); // Reset to first page when changing price range
  };

  // Handle date range filter
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setPage(1); // Reset to first page when changing date range
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    setCategory("");
    setSearchQuery("");
    setPriceRange({ min: null, max: null });
    setDateRange({ start: "", end: "" });
    setPage(1);
  };

  // Toggle filter visibility on mobile
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Execute search when search query changes
  useEffect(() => {
    // Small debounce for search
    const timer = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchEvents, searchQuery]);

  // Check if any filters are active
  const isFiltering =
    category ||
    searchQuery ||
    priceRange.min !== null ||
    priceRange.max !== null ||
    dateRange.start ||
    dateRange.end;

  return (
    <Container className="py-5">
      {/* Add style tag for custom filter styles */}
      <style>{filterContainerStyles}</style>
      <h1 className="mb-4">Explore Events</h1>

      <Row className="mb-4">
        <Col md={8}>
          <EventSearchBar
            value={searchQuery}
            onChange={handleSearch}
            noResults={hasNoSearchResults}
          />
        </Col>
        <Col
          md={4}
          className="d-flex justify-content-between align-items-center mt-3 mt-md-0"
        >
          {/* Mobile filter toggle button */}
          <button
            className="btn btn-outline-primary d-md-none me-auto"
            onClick={toggleFilters}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {isFiltering && (
            <button
              className="btn btn-outline-secondary ms-auto"
              onClick={handleClearFilters}
            >
              Clear All Filters
            </button>
          )}
        </Col>
      </Row>

      <Row>
        {/* Filter column - hidden on mobile by default unless toggled */}
        <Col
          xs={12}
          md={3}
          className={`mb-4 ${showFilters ? "d-block" : "d-none d-md-block"}`}
        >
          <div
            className="filter-container"
            style={{ position: "sticky", top: "1rem", zIndex: 100 }}
          >
            <div className="filter-content">
              <EventFilter
                selectedCategory={category}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
              />
            </div>
          </div>
        </Col>

        {/* Events list column */}
        <Col xs={12} md={9}>
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <AlertMessage variant="danger">{error}</AlertMessage>
          ) : events.length === 0 ? (
            <AlertMessage variant="info">
              {isFiltering
                ? `No events found matching your filters.`
                : "No events found."}
            </AlertMessage>
          ) : (
            <>
              <p className="text-muted mb-3">
                Showing {events.length} of {total} events
                {category && ` in category "${category}"`}
                {searchQuery && ` matching "${searchQuery}"`}
                {(priceRange.min !== null || priceRange.max !== null) &&
                  ` with price ${
                    priceRange.min !== null ? `$${priceRange.min}` : "$0"
                  } - 
                  ${priceRange.max !== null ? `$${priceRange.max}` : "any"}`}
                {(dateRange.start || dateRange.end) &&
                  ` from ${dateRange.start || "any date"} to ${
                    dateRange.end || "any date"
                  }`}
              </p>
              <EventList events={events} />

              {pages > 1 && (
                <div className="mt-4 d-flex justify-content-center">
                  <Pagination
                    currentPage={page}
                    totalPages={pages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default EventsPage;
