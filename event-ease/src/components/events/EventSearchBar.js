import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const EventSearchBar = ({ value, onChange, noResults }) => {
  const [searchTerm, setSearchTerm] = useState(value || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onChange(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onChange("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search for events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search events"
          className={noResults && searchTerm ? "is-invalid" : ""}
        />

        {searchTerm && (
          <Button
            variant="outline-secondary"
            onClick={handleClear}
            title="Clear search"
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        )}

        <Button variant="primary" type="submit">
          <FontAwesomeIcon icon={faSearch} className="me-2" />
          Search
        </Button>
      </InputGroup>

      {noResults && searchTerm && (
        <div className="invalid-feedback d-block">
          No results found for "{searchTerm}". Try different keywords.
        </div>
      )}
    </Form>
  );
};

export default EventSearchBar;
