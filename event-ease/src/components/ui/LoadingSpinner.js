// src/components/ui/LoadingSpinner.js
import { Spinner } from "react-bootstrap";

const LoadingSpinner = ({
  size = "md",
  variant = "primary",
  text = "Loading...",
  fullPage = false,
}) => {
  if (fullPage) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner
          animation="border"
          variant={variant}
          className={`spinner-border-${size}`}
          role="status"
        />
        <span className="mt-2">{text}</span>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center">
      <Spinner
        animation="border"
        variant={variant}
        size={size}
        role="status"
        className="me-2"
      />
      <span>{text}</span>
    </div>
  );
};

export default LoadingSpinner;
