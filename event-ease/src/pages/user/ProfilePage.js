// src/pages/user/ProfilePage.js
import React, { useState } from "react";
import { Container, Row, Col, Card, Tab, Nav, Alert } from "react-bootstrap";
import ProfileForm from "../../components/user/ProfileForm";
import ChangePasswordForm from "../../components/user/ChangePasswordForm";
import useAuth from "../../hooks/useAuth";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });

  // Show success message
  const showSuccess = (message) => {
    setAlert({
      show: true,
      variant: "success",
      message,
    });

    // Hide alert after 5 seconds
    setTimeout(() => {
      setAlert({ show: false, variant: "", message: "" });
    }, 5000);
  };

  // Show error message
  const showError = (message) => {
    setAlert({
      show: true,
      variant: "danger",
      message,
    });
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">My Profile</h1>

      {alert.show && (
        <Alert
          variant={alert.variant}
          dismissible
          onClose={() => setAlert({ show: false })}
        >
          {alert.message}
        </Alert>
      )}

      <Row>
        <Col lg={4} md={5} className="mb-4 mb-md-0">
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-3">{currentUser?.name}</h3>
              <p className="text-muted mb-3">@{currentUser?.username}</p>

              <div className="mb-3">
                <small className="text-muted d-block">Email</small>
                <p className="mb-0">{currentUser?.email}</p>
              </div>

              <div>
                <small className="text-muted d-block">Account Type</small>
                <p className="text-capitalize mb-0">{currentUser?.role}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8} md={7}>
          <Card className="shadow-sm">
            <Card.Body>
              <Tab.Container defaultActiveKey="profile">
                <Nav variant="tabs" className="mb-3">
                  <Nav.Item>
                    <Nav.Link eventKey="profile">Profile Information</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="password">Change Password</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="profile">
                    <ProfileForm
                      user={currentUser}
                      onSuccess={showSuccess}
                      onError={showError}
                    />
                  </Tab.Pane>

                  <Tab.Pane eventKey="password">
                    <ChangePasswordForm
                      onSuccess={showSuccess}
                      onError={showError}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
