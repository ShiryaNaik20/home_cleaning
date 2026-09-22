import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { services } from "../data/services";

const STATUS_ORDER = ["Pending", "Confirmed", "Completed", "Cancelled"];

const STATUS_CONFIG = {
  Pending:   { color: "bg-yellow-100 text-yellow-700", icon: "⏳" },
  Confirmed: { color: "bg-blue-100 text-blue-700",   icon: "✅" },
  Completed: { color: "bg-green-100 text-green-700", icon: "🎉" },
  Cancelled: { color: "bg-red-100 text-red-500",     icon: "❌" },
};

const NEXT_STATUS = {
  Pending:   "Confirmed",
  Confirmed: "Completed",
};

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(
    JSON.parse(localStorage.getItem("bookings") || "[]")
  );
  const [filterStatus, setFilterStatus] = useState("All");
  const [toast, setToast] = useState(null);

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-3">🔒</p>
        <h2 className="text-lg font-bold text-gray-800">Access Denied</h2>
        <p className="text-sm text-gray-500 mt-1">You need admin access to view this page.</p>
        <button onClick={() => navigate("/login")} className="mt-5 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold">
          Sign In as Admin
        </button>
      </div>
    );
  }

  function updateStatus(id, newStatus) {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: newStatus } : b
    );
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
    showToast(`Booking marked as ${newStatus} ✅`);
  }

  function cancelBooking(id) {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: "Cancelled" } : b
    );
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
    showToast("Booking cancelled");
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  // Summary counts
  const counts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  const filtered = filterStatus === "All"
    ? bookings
    : bookings.filter((b) => b.status === filterStatus);

  return (
    <div className="max-w-md mx-auto pb-24">
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 px-4 pt-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-indigo-200 text-xs font-medium">Operations Panel</p>
            <h1 className="text-white text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
            🛡️
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { status: "Pending", icon: "⏳", color: "bg-yellow-400" },
            { status: "Confirmed", icon: "✅", color: "bg-blue-400" },
            { status: "Completed", icon: "🎉", color: "bg-green-400" },
            { status: "Cancelled", icon: "❌", color: "bg-red-400" },
          ].map(({ status, icon, color }) => (
            <div key={status} className="bg-white/15 rounded-xl p-2.5 text-center">
              <p className="text-white font-bold text-lg">{counts[status] || 0}</p>
              <p className="text-white/70 text-xs mt-0.5">{status}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4">
        {/* Total revenue */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Total Revenue</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">
              ₹{bookings
                .filter((b) => b.status !== "Cancelled")
                .reduce((sum, b) => {
                  const svc = services.find((s) => s.id === b.serviceId);
                  return sum + (svc?.price || 0);
                }, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Total Bookings</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{bookings.length}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {["All", ...STATUS_ORDER].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap font-medium transition-colors flex-shrink-0 ${
                filterStatus === s
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-500 border-gray-200"
              }`}
            >
              {s} {s !== "All" && counts[s] ? `(${counts[s]})` : ""}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-gray-400 text-sm">No bookings in this category</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((booking) => {
              const service = services.find((s) => s.id === booking.serviceId);
              if (!service) return null;
              const config = STATUS_CONFIG[booking.status];
              const nextStatus = NEXT_STATUS[booking.status];

              return (
                <div key={booking.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  {/* Color strip */}
                  <div className={`h-1 ${
                    booking.status === "Confirmed" ? "bg-blue-500" :
                    booking.status === "Completed" ? "bg-green-500" :
                    booking.status === "Cancelled" ? "bg-red-400" : "bg-yellow-400"
                  }`} />

                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-lg">
                          {service.emoji}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{service.name}</p>
                          <p className="text-xs text-gray-400">#{booking.id.toString().slice(-6)}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${config.color}`}>
                        {config.icon} {booking.status}
                      </span>
                    </div>

                    {/* Customer info */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[
                        ["👤", booking.name],
                        ["📞", `+91 ${booking.phone}`],
                        ["📅", booking.date],
                        ["🕐", booking.timeSlot?.split("–")[0]?.trim()],
                      ].map(([icon, val]) => (
                        <div key={val} className="bg-gray-50 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                          <span className="text-xs">{icon}</span>
                          <span className="text-xs text-gray-600 font-medium truncate">{val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 rounded-lg px-2.5 py-1.5 flex items-start gap-1.5 mb-3">
                      <span className="text-xs mt-0.5">📍</span>
                      <span className="text-xs text-gray-600">{booking.address}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {nextStatus && (
                        <button
                          onClick={() => updateStatus(booking.id, nextStatus)}
                          className="flex-1 bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm shadow-indigo-200"
                        >
                          Mark as {nextStatus} →
                        </button>
                      )}
                      {booking.status !== "Cancelled" && booking.status !== "Completed" && (
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="px-3 py-2.5 border border-red-100 text-red-400 text-xs font-semibold rounded-xl hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}