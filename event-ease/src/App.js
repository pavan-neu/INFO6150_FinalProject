// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Public Pages
import HomePage from "./pages/public/HomePage";
// Import other public pages as needed

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import UnauthorizedPage from "./pages/auth/UnauthorizedPage";

// Protected Components
import ProtectedRoute from "./components/common/ProtectedRoute";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
// Import other user pages as needed

// Organizer Pages
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
// Import other organizer pages as needed

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
// Import other admin pages as needed
import ComponentsDemo from "./pages/public/ComponentsDemo";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="min-vh-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* User Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* Organizer Routes */}
            <Route
              path="/organizer/dashboard"
              element={
                <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/components-demo" element={<ComponentsDemo />} />

            {/* Add more routes as needed */}
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
