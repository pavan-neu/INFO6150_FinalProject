import React, { useState, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";

const EventFilter = ({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  dateRange,
  onDateRangeChange,
}) => {
  // Event categories from the model
  const categories = [
    "concert",
    "conference",
    "exhibition",
    "workshop",
    "sports",
    "festival",
    "other",
  ];

  // Local state to store values before applying
  const [minPrice, setMinPrice] = useState(priceRange?.min || "");
  const [maxPrice, setMaxPrice] = useState(priceRange?.max || "");
  const [startDate, setStartDate] = useState(dateRange?.start || "");
  const [endDate, setEndDate] = useState(dateRange?.end || "");
  const [priceError, setPriceError] = useState("");
  const [dateError, setDateError] = useState("");

  // Update local state when props change (this was missing)
  useEffect(() => {
    setMinPrice(priceRange?.min || "");
    setMaxPrice(priceRange?.max || "");
  }, [priceRange]);

  useEffect(() => {
    setStartDate(dateRange?.start || "");
    setEndDate(dateRange?.end || "");
  }, [dateRange]);

  // Handle price changes with validation
  const handleMinPriceChange = (value) => {
    setMinPrice(value);

    // Clear error when input changes
    setPriceError("");

    // Validate max price if it exists
    if (value !== "" && maxPrice !== "" && Number(value) > Number(maxPrice)) {
      setPriceError("Min price cannot be greater than max price");
    }
  };

  const handleMaxPriceChange = (value) => {
    setMaxPrice(value);

    // Clear error when input changes
    setPriceError("");

    // Validate min price if it exists
    if (value !== "" && minPrice !== "" && Number(value) < Number(minPrice)) {
      setPriceError("Max price cannot be less than min price");
    }
  };

  // Handle date changes with validation
  const handleStartDateChange = (value) => {
    setStartDate(value);

    // Clear error when input changes
    setDateError("");

    // Validate end date if it exists
    if (value !== "" && endDate !== "" && new Date(value) > new Date(endDate)) {
      setDateError("Start date cannot be after end date");
    }
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);

    // Clear error when input changes
    setDateError("");

    // Validate start date if it exists
    if (
      value !== "" &&
      startDate !== "" &&
      new Date(value) < new Date(startDate)
    ) {
      setDateError("End date cannot be before start date");
    }
  };

  // Handle price range filter with validation
  const handleApplyPriceFilter = () => {
    // Validate before applying
    if (
      minPrice !== "" &&
      maxPrice !== "" &&
      Number(minPrice) > Number(maxPrice)
    ) {
      setPriceError("Min price cannot be greater than max price");
      return;
    }

    onPriceRangeChange({
      min: minPrice === "" ? null : Number(minPrice),
      max: maxPrice === "" ? null : Number(maxPrice),
    });
  };

  // Handle date range filter with validation
  const handleApplyDateFilter = () => {
    // Validate before applying
    if (
      startDate !== "" &&
      endDate !== "" &&
      new Date(startDate) > new Date(endDate)
    ) {
      setDateError("Start date cannot be after end date");
      return;
    }

    onDateRangeChange({
      start: startDate,
      end: endDate,
    });
  };

  // Reset filters
  const handleResetPriceFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    setPriceError("");
    onPriceRangeChange({ min: null, max: null });
  };

  const handleResetDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setDateError("");
    onDateRangeChange({ start: "", end: "" });
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title as="h5" className="mb-3">
          Filter Events
        </Card.Title>

        {/* Category Filter */}
        <div className="mb-4">
          <h6>Category</h6>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Select category"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Price Range Filter */}
        <div className="mb-4">
          <h6>Price Range</h6>
          <Form>
            <div className="d-flex gap-2 mb-2">
              <Form.Group className="flex-grow-1">
                <Form.Control
                  type="number"
                  placeholder="Min $"
                  value={minPrice}
                  onChange={(e) => handleMinPriceChange(e.target.value)}
                  min="0"
                  isInvalid={!!priceError}
                />
              </Form.Group>

              <span className="align-self-center">-</span>

              <Form.Group className="flex-grow-1">
                <Form.Control
                  type="number"
                  placeholder="Max $"
                  value={maxPrice}
                  onChange={(e) => handleMaxPriceChange(e.target.value)}
                  min="0"
                  isInvalid={!!priceError}
                />
              </Form.Group>
            </div>

            {priceError && (
              <div className="text-danger mb-2 small">{priceError}</div>
            )}

            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                className="flex-grow-1"
                onClick={handleApplyPriceFilter}
                disabled={!!priceError}
              >
                Apply
              </Button>

              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleResetPriceFilter}
              >
                Reset
              </Button>
            </div>
          </Form>
        </div>

        {/* Date Range Filter */}
        <div className="mb-3">
          <h6>Date Range</h6>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label className="small">From</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                isInvalid={!!dateError}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small">To</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                isInvalid={!!dateError}
              />
            </Form.Group>

            {dateError && (
              <div className="text-danger mb-2 small">{dateError}</div>
            )}

            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                className="flex-grow-1"
                onClick={handleApplyDateFilter}
                disabled={!!dateError}
              >
                Apply
              </Button>

              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleResetDateFilter}
              >
                Reset
              </Button>
            </div>
          </Form>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EventFilter;
