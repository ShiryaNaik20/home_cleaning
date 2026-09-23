import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { services } from "../data/services";

const STATUS_ORDER = ["Pending", "Confirmed", "Completed", "Cancelled"];

const STATUS_CONFIG = {
  Pending:   { color: "bg-amber-100 text-amber-700",   bar: "bg-amber-400",   icon: "⏳" },
  Confirmed: { color: "bg-[#e6f4ef] text-[#0a7a53]",  bar: "bg-[#0a7a53]",   icon: "✅" },
  Completed: { color: "bg-teal-100 text-teal-700",     bar: "bg-teal-500",    icon: "🎉" },
  Cancelled: { color: "bg-rose-100 text-rose-600",     bar: "bg-rose-500",    icon: "❌" },
};

const NEXT_STATUS = { Pending: "Confirmed", Confirmed: "Completed" };

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
      <div className="bg-[#f2f6f4] min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-emerald-900/5 max-w-sm w-full animate-scaleIn">
          <p className="text-5xl mb-3">🔒</p>
          <h2 className="text-lg font-bold text-gray-800">Access Denied</h2>
          <p className="text-sm text-gray-500 mt-1">You need admin access to view this page.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-5 bg-[#0a7a53] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#086343] transition-all"
          >
            Sign In as Admin
          </button>
        </div>
      </div>
    );
  }

  function updateStatus(id, newStatus) {
    const updated = bookings.map((b) => b.id === id ? { ...b, status: newStatus } : b);
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
    showToast(`Marked as ${newStatus} ✅`);
  }

  function cancelBooking(id) {
    const updated = bookings.map((b) => b.id === id ? { ...b, status: "Cancelled" } : b);
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
    showToast("Booking cancelled");
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const counts = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});

  const totalRevenue = bookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => {
      const svc = services.find((s) => s.id === b.serviceId);
      return sum + (svc?.price || 0);
    }, 0);

  const filtered = filterStatus === "All" ? bookings : bookings.filter((b) => b.status === filterStatus);

  return (
    <div className="bg-[#f2f6f4] min-h-screen pb-24">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-lg animate-slideDown">
          {toast}
        </div>
      )}

      {/* Header — emerald with amber admin badge */}
      <div className="bg-[#0a7a53] px-4 pt-6 pb-8 rounded-b-[2.5rem] shadow-md">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="animate-fadeInUp">
              <p className="text-emerald-200 text-xs font-semibold">Operations Panel</p>
              <h1 className="text-white text-2xl sm:text-3xl font-bold mt-0.5">Admin Dashboard</h1>
            </div>
            <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-2xl shadow-md animate-checkPop">
              🛡️
            </div>
          </div>

          {/* Summary Cards — 2 col on mobile, 4 col on sm+ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger">
            {[
              { status: "Pending",   icon: "⏳", accent: "text-amber-300" },
              { status: "Confirmed", icon: "✅", accent: "text-emerald-200" },
              { status: "Completed", icon: "🎉", accent: "text-teal-200" },
              { status: "Cancelled", icon: "❌", accent: "text-rose-300" },
            ].map(({ status, icon, accent }) => (
              <div key={status} className="bg-white/15 backdrop-blur-sm rounded-2xl p-3.5 text-center animate-fadeInUp border border-white/10">
                <p className={`text-xl font-extrabold text-white`}>{counts[status] || 0}</p>
                <p className={`text-xs mt-0.5 font-medium ${accent}`}>{icon} {status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 mt-8 space-y-4">

        {/* Revenue + Bookings row */}
        <div className="grid grid-cols-2 gap-3 animate-fadeInUp">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-900/5">
            <p className="text-xs text-gray-400 font-medium">Total Revenue</p>
            <p className="text-xl font-extrabold text-[#0a7a53] mt-0.5">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-900/5">
            <p className="text-xs text-gray-400 font-medium">Total Bookings</p>
            <p className="text-xl font-extrabold text-gray-900 mt-0.5">{bookings.length}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none animate-fadeInUp">
          {["All", ...STATUS_ORDER].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-4 py-2 rounded-full border whitespace-nowrap font-semibold transition-all flex-shrink-0 ${
                filterStatus === s
                  ? "bg-[#0a7a53] text-white border-[#0a7a53] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-[#e6f4ef] hover:border-emerald-200"
              }`}
            >
              {STATUS_CONFIG[s]?.icon} {s} {s !== "All" && counts[s] ? `(${counts[s]})` : ""}
            </button>
          ))}
        </div>

        {/* Bookings Grid — 1 col mobile, 2 col on md+ */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-emerald-900/5 animate-fadeIn">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-gray-500 font-semibold">No bookings in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
            {filtered.map((booking) => {
              const service = services.find((s) => s.id === booking.serviceId);
              if (!service) return null;
              const config = STATUS_CONFIG[booking.status];
              const nextStatus = NEXT_STATUS[booking.status];

              return (
                <div key={booking.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-900/5 transition-all hover:shadow-md animate-fadeInUp">
                  {/* Status color strip */}
                  <div className={`h-1.5 ${config.bar}`} />

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-[#e6f4ef] rounded-2xl flex items-center justify-center text-xl border border-emerald-100/50">
                          {service.emoji}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{service.name}</p>
                          <p className="text-xs text-gray-400 font-mono">#{booking.id.toString().slice(-6)}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${config.color}`}>
                        {config.icon} {booking.status}
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {[
                        ["👤", booking.name],
                        ["📞", `+91 ${booking.phone}`],
                        ["📅", booking.date],
                        ["🕐", booking.timeSlot?.split("–")[0]?.trim()],
                      ].map(([icon, val]) => (
                        <div key={val} className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-1.5 border border-gray-100">
                          <span className="text-xs">{icon}</span>
                          <span className="text-xs text-gray-700 font-semibold truncate">{val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-start gap-1.5 mb-4 border border-gray-100">
                      <span className="text-xs mt-0.5">📍</span>
                      <span className="text-xs text-gray-600 leading-snug">{booking.address}</span>
                    </div>

                    {/* Price row */}
                    <div className="flex items-center justify-between mb-4 px-0.5">
                      <span className="text-xs text-gray-400 font-medium">Amount</span>
                      <span className="font-bold text-[#0a7a53] text-sm">₹{service.price}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {nextStatus && (
                        <button
                          onClick={() => updateStatus(booking.id, nextStatus)}
                          className="flex-1 bg-[#0a7a53] hover:bg-[#086343] text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
                        >
                          Mark as {nextStatus} →
                        </button>
                      )}
                      {booking.status !== "Cancelled" && booking.status !== "Completed" && (
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="px-4 py-2.5 border border-rose-200 text-rose-500 text-xs font-bold rounded-xl hover:bg-rose-50 transition-all"
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