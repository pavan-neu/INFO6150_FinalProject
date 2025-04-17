// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import GlobalToast from "./components/ui/GlobalToast";
// Add these imports for Stripe integration
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "./utils/stripeConfig";

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
import UserManagementPage from "./pages/admin/UserManagementPage";
import UserDetailPage from "./pages/admin/UserDetailPage";
import EventManagementPage from "./pages/admin/EventManagementPage";
// Import new components at the top of your App.js file
import AdminEventDetailPage from "./pages/admin/AdminEventDetailPage";
import AdminFeaturedEventsPage from "./pages/admin/AdminFeaturedEventsPage";

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
import EventTicketsPage from "./pages/organizer/EventTicketsPage";
import EventSalesPage from "./pages/organizer/EventSalesPage";

// Import the new CheckoutPage component
import CheckoutPage from "./pages/user/CheckoutPage";

import AdminEventTicketsPage from "./pages/admin/AdminEventTicketsPage.js";
import AdminEventTransactionsPage from "./pages/admin/AdminEventTransactionsPage";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        {/* Wrap the entire app with Stripe Elements provider */}
        <Elements stripe={stripePromise}>
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
                {/* Add the new checkout route here */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />

                {/* Organizer Routes - Deny access to admin users */}
                <Route
                  path="/organizer/dashboard"
                  element={
                    <ProtectedRoute
                      allowedRoles={["organizer"]}
                      denyRoles={["admin"]}
                    >
                      <OrganizerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/events/create"
                  element={
                    <ProtectedRoute
                      allowedRoles={["organizer"]}
                      denyRoles={["admin"]}
                    >
                      <CreateEventPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/events/:eventId/edit"
                  element={
                    <ProtectedRoute
                      allowedRoles={["organizer"]}
                      denyRoles={["admin"]}
                    >
                      <EditEventPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/events"
                  element={
                    <ProtectedRoute
                      allowedRoles={["organizer"]}
                      denyRoles={["admin"]}
                    >
                      <OrganizerEventsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/events/:eventId/tickets"
                  element={
                    <ProtectedRoute
                      allowedRoles={["organizer"]}
                      denyRoles={["admin"]}
                    >
                      <EventTicketsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/tickets/:ticketId"
                  element={
                    <ProtectedRoute
                      allowedRoles={["organizer"]}
                      denyRoles={["admin"]}
                    >
                      <TicketDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/organizer/events/:eventId/sales"
                  element={
                    <ProtectedRoute
                      allowedRoles={["organizer"]}
                      denyRoles={["admin"]}
                    >
                      <EventSalesPage />
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
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <UserManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users/:userId"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <UserDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/events"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <EventManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/events/:eventId"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminEventDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/events/featured"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminFeaturedEventsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/events/:eventId/tickets"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminEventTicketsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/events/:eventId/transactions"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AdminEventTransactionsPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </Router>
        </Elements>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;