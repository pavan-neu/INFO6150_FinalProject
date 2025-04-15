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
    <Button variant="outline-light" onClick={handleLogout} className="ms-2">
      Logout
    </Button>
  );
};

export default LogoutButton;
