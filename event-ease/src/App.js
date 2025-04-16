// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import GlobalToast from "./components/ui/GlobalToast";

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
import ProfilePage from "./pages/user/ProfilePage";
// Import other user pages as needed

// Organizer Pages
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
// Import other organizer pages as needed

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
// Import other admin pages as needed
import ComponentsDemo from "./pages/public/ComponentsDemo";

import EventsPage from "./pages/public/EventsPage";
import EventDetailPage from "./pages/public/EventDetailPage";

import AboutPage from "./pages/public/AboutPage";
import FAQPage from "./pages/public/FAQPage";
import ContactPage from "./pages/public/ContactPage";

import UserTicketsPage from "./pages/user/UserTicketsPage";
import TicketDetailPage from "./pages/user/TicketDetailPage";
import TicketCancellationPage from "./pages/user/TicketCancellationPage";

import UserTransactionsPage from "./pages/user/UserTransactionsPage";
import TransactionDetailPage from "./pages/user/TransactionDetailPage";

import CreateEventPage from "./pages/organizer/CreateEventPage";
import EditEventPage from "./pages/organizer/EditEventPage";
import OrganizerEventsPage from "./pages/organizer/OrganizerEventsPage";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Navbar />
          <GlobalToast />
          <main className="min-vh-100">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/components-demo" element={<ComponentsDemo />} />
              {/* User Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
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
              <Route
                path="/tickets"
                element={
                  <ProtectedRoute>
                    <UserTicketsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tickets/:ticketId"
                element={
                  <ProtectedRoute>
                    <TicketDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tickets/:ticketId/cancel"
                element={
                  <ProtectedRoute>
                    <TicketCancellationPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <UserTransactionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions/:transactionId"
                element={
                  <ProtectedRoute>
                    <TransactionDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/events/create"
                element={
                  <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <CreateEventPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/events/:eventId/edit"
                element={
                  <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <EditEventPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/events"
                element={
                  <ProtectedRoute allowedRoles={["organizer", "admin"]}>
                    <OrganizerEventsPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
