import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { services } from "../data/services";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const latest = bookings[0];
  const service = latest ? services.find((s) => s.id === latest.serviceId) : null;

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!latest || !service) {
    navigate("/");
    return null;
  }

  return (
    <div className="bg-[#f2f6f4] min-h-screen pb-24">
      {/* Header with sufficient bottom padding */}
      <div className="bg-[#0a7a53] text-white px-6 pt-10 pb-8 rounded-b-[2rem] shadow-sm text-center">
        <div className="max-w-3xl mx-auto">
          <div className="animate-checkPop">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mx-auto shadow-md">
              ✅
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-4 tracking-tight">
            Booking Confirmed!
          </h1>
          <p className="text-emerald-100 text-sm mt-1 font-semibold">
            Your cleaner is on the way
          </p>
        </div>
      </div>

      {/* Main Content Card Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-8 animate-fadeInUp">
        {/* Booking Details Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-emerald-900/5 overflow-hidden mb-5">
          {/* Service Banner */}
          <div className="bg-emerald-50/50 px-5 py-4 flex items-center justify-between border-b border-emerald-100/60">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{service.emoji}</span>
              <div>
                <p className="font-bold text-gray-900 text-sm sm:text-base">{service.name}</p>
                <p className="text-xs text-gray-400 font-medium">Home Cleaning</p>
              </div>
            </div>
            <span className="text-xs bg-emerald-100 text-[#0a7a53] px-3 py-1 rounded-full font-bold">
              ✅ Confirmed
            </span>
          </div>

          {/* Details List */}
          <div className="p-5 space-y-3.5">
            {[
              ["👤", "Customer Name", latest.name],
              ["📅", "Date", latest.date],
              ["🕐", "Time Slot", latest.timeSlot],
              ["📍", "Address", latest.address],
              ["💰", "Amount Paid", `₹${service.price}`],
            ].map(([icon, label, value]) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 text-sm">
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className="text-xs sm:text-sm font-bold text-gray-800 mt-0.5 leading-snug">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Booking ID Footer */}
          <div className="bg-emerald-50/40 px-5 py-3 border-t border-emerald-100/60 flex items-center justify-between">
            <span className="text-xs text-[#0a7a53] font-bold uppercase tracking-wider">Booking ID</span>
            <span className="text-xs font-mono font-bold text-gray-700 tracking-wider">
              #{latest.id.toString().slice(-8).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/my-bookings")}
            className="flex-1 bg-[#0a7a53] hover:bg-[#086343] text-white font-bold py-3.5 rounded-2xl text-sm shadow-sm transition-all active:scale-95"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 text-gray-700 font-bold py-3.5 rounded-2xl text-sm border border-emerald-900/10 bg-white hover:bg-gray-50 transition-all active:scale-95"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}