// src/components/ui/ToastMessage.js
import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastMessage = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  // We'll keep this with a fixed value since we're only handling success messages for now
  const variant = "success";

  useEffect(() => {
    // Check for auth messages in sessionStorage
    const authMessage = sessionStorage.getItem("auth_message");
    if (authMessage) {
      setMessage(authMessage);
      setShow(true);
      // Clear the message from sessionStorage
      sessionStorage.removeItem("auth_message");
    }
  }, []);

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1070 }}>
      <Toast
        onClose={() => setShow(false)}
        show={show}
        delay={3000}
        autohide
        bg={variant === "success" ? "success" : "danger"}
      >
        <Toast.Header>
          <strong className="me-auto">
            {variant === "success" ? "Success" : "Error"}
          </strong>
        </Toast.Header>
        <Toast.Body className={variant === "success" ? "text-white" : ""}>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastMessage;
