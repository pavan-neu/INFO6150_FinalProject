// src/components/common/ProtectedRoute.js
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Spinner } from "react-bootstrap";

const ProtectedRoute = ({ children, allowedRoles = [], denyRoles = [] }) => {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    // Return a proper loading spinner
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login page with the return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // If deny roles are specified, check if user has a denied role
  if (denyRoles.length > 0 && denyRoles.includes(currentUser.role)) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized, render the protected content
  return children;
};

export default ProtectedRoute;
