// src/components/ui/GlobalToast.js
import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useToast } from "../../context/ToastContext";

const GlobalToast = () => {
  const { toast, hideToast } = useToast();

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1070 }}>
      <Toast
        onClose={hideToast}
        show={toast.show}
        delay={3000}
        autohide
        bg={toast.variant}
      >
        <Toast.Header>
          <strong className="me-auto">
            {toast.variant === "success" ? "Success" : "Error"}
          </strong>
        </Toast.Header>
        <Toast.Body className="text-white">{toast.message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default GlobalToast;
