import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import ServiceListing from "./pages/ServiceListing";
import ServiceDetail from "./pages/ServiceDetail";
import BookingForm from "./pages/BookingForm";
import OTPVerification from "./pages/OTPVerification";
import BookingSuccess from "./pages/BookingSuccess";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";

// Protect routes that need login
function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

// Protect admin-only routes
function RequireAdmin({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* User routes — require login */}
          <Route path="/" element={<RequireAuth><ServiceListing /></RequireAuth>} />
          <Route path="/service/:id" element={<RequireAuth><ServiceDetail /></RequireAuth>} />
          <Route path="/book/:id" element={<RequireAuth><BookingForm /></RequireAuth>} />
          <Route path="/otp/:id" element={<RequireAuth><OTPVerification /></RequireAuth>} />
          <Route path="/booking-success" element={<RequireAuth><BookingSuccess /></RequireAuth>} />
          <Route path="/my-bookings" element={<RequireAuth><MyBookings /></RequireAuth>} />

          {/* Admin route */}
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}