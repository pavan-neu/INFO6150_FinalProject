// src/components/ui/AlertMessage.js
import { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";

const AlertMessage = ({
  variant = "info",
  message,
  dismissible = true,
  timeout = 0,
  onClose = () => {},
}) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (timeout > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [timeout, onClose]);

  if (!message || !show) return null;

  return (
    <Alert
      variant={variant}
      onClose={() => {
        setShow(false);
        onClose();
      }}
      dismissible={dismissible}
      className="animate__animated animate__fadeIn"
    >
      {message}
    </Alert>
  );
};

export default AlertMessage;
