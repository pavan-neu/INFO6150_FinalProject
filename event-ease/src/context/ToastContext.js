// src/context/ToastContext.js
import React, { createContext, useState, useContext } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast({ show: false, message: "", variant: "success" });
    }, 3000);
  };

  const hideToast = () => {
    setToast({ show: false, message: "", variant: "success" });
  };

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

// Custom hook for using the toast
export const useToast = () => useContext(ToastContext);

export default ToastContext;
