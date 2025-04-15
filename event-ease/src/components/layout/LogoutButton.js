// src/components/layout/LogoutButton.js
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Button
      variant="outline-light"
      onClick={handleLogout}
      className="ms-2 logout-btn"
    >
      <i className="bi bi-box-arrow-right me-1"></i> Logout
    </Button>
  );
};

export default LogoutButton;
