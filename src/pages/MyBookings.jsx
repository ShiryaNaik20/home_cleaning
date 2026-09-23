import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { services } from "../data/services";
import { useAuth } from "../context/AuthContext";
import { ReviewForm } from "../components/Reviews";

const STATUS_CONFIG = {
  Confirmed: { color: "bg-emerald-100 text-[#0a7a53]", icon: "✅", step: 1 },
  Pending:   { color: "bg-amber-100 text-amber-700",   icon: "⏳", step: 0 },
  Completed: { color: "bg-teal-100 text-teal-800",     icon: "🎉", step: 2 },
  Cancelled: { color: "bg-rose-100 text-rose-600",     icon: "❌", step: -1 },
};

function hasReviewed(bookingId) {
  // scan every service's review list for this bookingId
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("reviews_")) {
      const reviews = JSON.parse(localStorage.getItem(key) || "[]");
      if (reviews.find((r) => r.bookingId === bookingId)) return true;
    }
  }
  return false;
}

export default function MyBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState(
    JSON.parse(localStorage.getItem("bookings") || "[]")
  );
  const [cancelledId, setCancelledId] = useState(null);
  const [reviewingId, setReviewingId] = useState(null); // bookingId currently being reviewed
  const [reviewedIds, setReviewedIds] = useState(() =>
    bookings.filter((b) => hasReviewed(b.id)).map((b) => b.id)
  );

  function cancelBooking(id) {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: "Cancelled" } : b
    );
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
    setCancelledId(id);
  }

  function handleReviewDone(bookingId) {
    setReviewedIds((prev) => [...prev, bookingId]);
    setReviewingId(null);
  }

  /* ── Empty state ── */
  if (bookings.length === 0) {
    return (
      <div className="bg-[#f2f6f4] min-h-screen pb-24">
        <div className="bg-[#0a7a53] text-white px-6 pt-8 pb-8 rounded-b-[2rem] shadow-sm">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
              My Bookings
            </h1>
            <p className="text-emerald-100 text-sm mt-1 font-medium">Your cleaning history</p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 animate-fadeInUp">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-900/5 text-center py-14">
            <div className="w-20 h-20 bg-emerald-50 text-[#0a7a53] rounded-full flex items-center justify-center mx-auto text-4xl mb-4">
              🗓️
            </div>
            <h2 className="text-xl font-bold text-gray-800">No bookings yet</h2>
            <p className="text-sm text-gray-500 mt-1 mb-6 max-w-xs mx-auto font-[Poppins]">
              Book your first cleaning session and it'll show up here.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#0a7a53] hover:bg-[#086343] text-white font-bold px-8 py-3.5 rounded-full text-sm shadow-sm transition-all active:scale-95"
            >
              Browse Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Bookings list ── */
  return (
    <div className="bg-[#f2f6f4] min-h-screen pb-28">
      <div className="bg-[#0a7a53] text-white px-6 pt-8 pb-8 rounded-b-[2rem] shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Bookings
          </h1>
          <p className="text-emerald-100 text-sm mt-1 font-semibold tracking-wide">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-2.5 mt-4 flex-wrap">
            {Object.entries(
              bookings.reduce((acc, b) => {
                acc[b.status] = (acc[b.status] || 0) + 1;
                return acc;
              }, {})
            ).map(([status, count]) => (
              <span
                key={status}
                className="text-xs bg-white/20 backdrop-blur-md text-white font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20"
              >
                {STATUS_CONFIG[status]?.icon} {count} {status}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 space-y-5 stagger">
        {bookings.map((booking) => {
          const service = services.find((s) => s.id === booking.serviceId);
          if (!service) return null;
          const config = STATUS_CONFIG[booking.status] || {};
          const justCancelled = cancelledId === booking.id;
          const isCompleted = booking.status === "Completed";
          const alreadyReviewed = reviewedIds.includes(booking.id);
          const showingReviewForm = reviewingId === booking.id;

          return (
            <div
              key={booking.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-emerald-900/5 transition-all hover:shadow-md animate-fadeInUp"
            >
              {/* Status color strip */}
              <div
                className={`h-1.5 ${
                  booking.status === "Confirmed"
                    ? "bg-[#0a7a53]"
                    : booking.status === "Completed"
                    ? "bg-teal-500"
                    : booking.status === "Cancelled"
                    ? "bg-rose-500"
                    : "bg-amber-400"
                }`}
              />

              <div className="p-5 sm:p-6">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl border border-emerald-100/50 flex-shrink-0">
                      {service.emoji}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base leading-tight">
                        {service.name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">
                        #{booking.id.toString().slice(-6)}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-bold flex-shrink-0 ${config.color}`}>
                    {config.icon} {booking.status}
                  </span>
                </div>

                {/* Progress Bar */}
                {booking.status !== "Cancelled" && (
                  <div className="mb-5 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100/50">
                    <div className="flex items-center gap-1">
                      {["Pending", "Confirmed", "Completed"].map((step, i) => {
                        const active = i <= config.step;
                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                                active
                                  ? "bg-[#0a7a53] text-white shadow-sm"
                                  : "bg-gray-200 text-gray-400"
                              }`}
                            >
                              {i + 1}
                            </div>
                            {i < 2 && (
                              <div
                                className={`flex-1 h-1.5 mx-2 rounded-full transition-colors ${
                                  i < config.step ? "bg-[#0a7a53]" : "bg-gray-200"
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-2.5 px-0.5">
                      {["Pending", "Confirmed", "Completed"].map((s) => (
                        <span key={s} className="text-[11px] font-semibold text-gray-500">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-2.5">
                  {[
                    ["📅", "DATE",   booking.date],
                    ["🕐", "TIME",   booking.timeSlot?.split("–")[0]?.trim()],
                    ["👤", "NAME",   booking.name],
                    ["💰", "AMOUNT", `₹${service.price}`],
                  ].map(([icon, label, val]) => (
                    <div key={label} className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">
                        {icon} {label}
                      </p>
                      <p className="text-xs font-bold text-gray-800 truncate">{val}</p>
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 mb-5">
                  <p className="text-[10px] font-bold text-gray-400 tracking-wider mb-1">
                    📍 ADDRESS
                  </p>
                  <p className="text-xs font-semibold text-gray-700 leading-snug">
                    {booking.address}
                  </p>
                </div>

                {/* ── Review prompt for completed bookings ── */}
                {isCompleted && !showingReviewForm && (
                  <div className="mb-4">
                    {alreadyReviewed ? (
                      <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-2xl px-4 py-3">
                        <span className="text-lg">⭐</span>
                        <p className="text-xs font-semibold text-teal-700">
                          Thanks! Your review has been submitted.
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReviewingId(booking.id)}
                        className="w-full flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 font-bold text-xs py-3.5 rounded-2xl transition-colors"
                      >
                        ⭐ Rate &amp; Review this service
                      </button>
                    )}
                  </div>
                )}

                {/* ── Inline review form ── */}
                {isCompleted && showingReviewForm && (
                  <div className="mb-4">
                    <ReviewForm
                      serviceId={booking.serviceId}
                      serviceName={service.name}
                      bookingId={booking.id}
                      userName={booking.name || user?.name}
                      onDone={() => handleReviewDone(booking.id)}
                    />
                    <button
                      onClick={() => setReviewingId(null)}
                      className="mt-2 w-full text-xs text-gray-400 hover:text-gray-600 font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2.5">
                  {booking.status === "Confirmed" && (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="flex-1 text-rose-600 text-xs font-bold border border-rose-200 py-3 rounded-2xl hover:bg-rose-50 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/")}
                    className={`text-xs font-bold py-3 rounded-2xl transition-all ${
                      booking.status === "Confirmed"
                        ? "flex-1 text-[#0a7a53] border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/60"
                        : "w-full bg-[#0a7a53] text-white shadow-sm hover:bg-[#086343] active:scale-95"
                    }`}
                  >
                    {booking.status === "Cancelled" ? "Book Again 🔄" : "Book Another"}
                  </button>
                </div>

                {justCancelled && (
                  <div className="mt-3 bg-amber-50 border border-amber-200/60 rounded-2xl p-3 text-center animate-fadeIn">
                    <p className="text-xs text-amber-800 font-semibold">
                      Booking cancelled. We hope to see you again! 👋
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <button
          onClick={() => navigate("/")}
          className="w-full bg-white border border-emerald-900/10 text-gray-700 font-bold py-3.5 rounded-2xl text-sm shadow-sm hover:bg-gray-50 transition-all active:scale-95"
        >
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
}
