import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { services, timeSlots } from "../data/services";
import { useAuth } from "../context/AuthContext";

export default function BookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const service = services.find((s) => s.id === Number(id));

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    date: "",
    timeSlot: "",
  });

  const [errors, setErrors] = useState({});

  // Today's date in YYYY-MM-DD format (local time, not UTC)
  const today = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  })();

  function validate() {
    const e = {};

    if (!form.name.trim()) {
      e.name = "Name is required.";
    }

    if (!form.phone.trim()) {
      e.phone = "Phone number is required.";
    } else if (form.phone.length !== 10) {
      e.phone = "Phone number must be exactly 10 digits.";
    } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
      e.phone = "Enter a valid mobile number";
    }

    if (!form.address.trim()) {
      e.address = "Address is required.";
    }

    if (!form.date) {
      e.date = "Please select a date.";
    } else if (form.date < today) {
      e.date = "Date cannot be in the past";
    }

    if (!form.timeSlot) {
      e.timeSlot = "Please select a time slot.";
    }

    return e;
  }

  function handleChange(field, value) {
    setForm((f) => ({
      ...f,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((e) => ({
        ...e,
        [field]: undefined,
      }));
    }
  }

  function handlePhoneChange(value) {
    // Only allow digits, max 10
    const digits = value.replace(/\D/g, "").slice(0, 10);
    handleChange("phone", digits);
  }

  function handleSubmit() {
    const e = validate();

    if (Object.keys(e).length > 0) {
      setErrors(e);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    sessionStorage.setItem(
      "pendingBooking",
      JSON.stringify({
        serviceId: Number(id),
        ...form,
      })
    );

    navigate(`/otp/${id}`);
  }

  if (!service) return null;

  return (
    <div className="bg-[#f2f6f4] min-h-screen pb-36 animate-fadeIn">
      {/* Header */}
      <div className="bg-[#0a7a53] text-white px-4 pt-6 pb-8 rounded-b-[2.5rem] shadow-md">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white mb-4 transition-all"
          >
            ←
          </button>

          <h1 className="text-white text-2xl font-bold">
            Booking Details
          </h1>

          <p className="text-emerald-100 text-xs sm:text-sm mt-1 font-medium">
            {service.emoji || "🧹"} {service.name} · ₹{service.price}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8 space-y-4">

        {/* Full Name */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-900/5 animate-fadeInUp">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Full Name
          </label>

          <input
            type="text"
            placeholder="e.g. Rahul Sharma"
            value={form.name}
            onChange={(e) =>
              handleChange("name", e.target.value)
            }
            className={`w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.name
                ? "border border-red-400 bg-red-50/50 text-red-900 focus:ring-red-200"
                : "border border-gray-100 bg-gray-50 text-gray-800 focus:ring-emerald-300"
            }`}
          />

          {errors.name && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
              ⚠️ {errors.name}
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-900/5">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Mobile Number
          </label>

          <div className="flex gap-2">
            <div className="flex items-center px-3.5 py-3 border border-gray-100 bg-gray-100 rounded-2xl text-xs sm:text-sm text-gray-600 select-none font-bold">
              🇮🇳 +91
            </div>

            <input
              type="tel"
              placeholder="9876543210"
              value={form.phone}
              onChange={(e) =>
                handlePhoneChange(e.target.value)
              }
              maxLength={10}
              className={`flex-1 px-4 py-3.5 border rounded-2xl text-sm focus:outline-none focus:ring-2 transition-all tracking-widest font-bold ${
                errors.phone
                  ? "border-red-400 bg-red-50/50 text-red-900 focus:ring-red-200"
                  : form.phone.length === 10
                  ? "border-emerald-500 bg-emerald-50/30 text-gray-800 focus:ring-emerald-300"
                  : "border-gray-100 bg-gray-50 text-gray-800 focus:ring-emerald-300"
              }`}
            />
          </div>

          <div className="flex items-center justify-between mt-1.5">
            {errors.phone ? (
              <p className="text-red-500 text-xs flex items-center gap-1 font-medium">
                ⚠️ {errors.phone}
              </p>
            ) : (
              <p className="text-xs text-gray-400 font-medium">
                {form.phone.length === 10
                  ? "✅ Valid number"
                  : form.phone.length > 0
                  ? `${form.phone.length}/10 digits entered`
                  : "Enter 10-digit mobile number"}
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-900/5">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Service Address
          </label>

          <textarea
            placeholder="Flat no., Building, Street, City, PIN"
            value={form.address}
            onChange={(e) =>
              handleChange("address", e.target.value)
            }
            rows={3}
            className={`w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 resize-none transition-all ${
              errors.address
                ? "border border-red-400 bg-red-50/50 text-red-900 focus:ring-red-200"
                : "border border-gray-100 bg-gray-50 text-gray-800 focus:ring-emerald-300"
            }`}
          />

          {errors.address && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
              ⚠️ {errors.address}
            </p>
          )}
        </div>

        {/* Preferred Date */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-900/5">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Preferred Date
          </label>

          <input
            type="date"
            min={today}
            value={form.date}
            onChange={(e) =>
              handleChange("date", e.target.value)
            }
            className={`w-full px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.date
                ? "border border-red-400 bg-red-50/50 text-red-900 focus:ring-red-200"
                : form.date
                ? "border border-emerald-500 bg-emerald-50/30 text-gray-800 focus:ring-emerald-300"
                : "border border-gray-100 bg-gray-50 text-gray-800 focus:ring-emerald-300"
            }`}
          />

          {errors.date ? (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
              ⚠️ {errors.date}
            </p>
          ) : (
            <p className="text-gray-400 text-xs mt-1.5 font-medium">
              Please select a date from today onwards.
            </p>
          )}
        </div>

        {/* Time Slot */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-900/5">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
            Time Slot
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() =>
                  handleChange("timeSlot", slot)
                }
                className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all ${
                  form.timeSlot === slot
                    ? "bg-[#0a7a53] text-white border-[#0a7a53] shadow-sm scale-[1.02]"
                    : "bg-gray-50 text-gray-700 border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          {errors.timeSlot && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1 font-medium">
              ⚠️ {errors.timeSlot}
            </p>
          )}
        </div>

        {/* Price Summary */}
        <div className="bg-[#e6f4ef]/60 border border-emerald-900/5 rounded-3xl p-5">
          <h3 className="text-sm font-bold text-gray-800 mb-3">
            Price Summary
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-500 font-medium">
                Service charge
              </span>

              <span className="font-semibold text-gray-800">
                ₹{service.price}
              </span>
            </div>

            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-500 font-medium">
                Platform fee
              </span>

              <span className="font-bold text-[#0a7a53]">
                Free
              </span>
            </div>

            <div className="border-t border-emerald-900/10 pt-2 flex justify-between items-center">
              <span className="font-bold text-gray-900 text-sm">
                Total
              </span>

              <span className="font-bold text-[#0a7a53] text-xl">
                ₹{service.price}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Submit Button */}
      <div className="fixed bottom-16 left-0 right-0 z-40 px-4 py-3 bg-white/90 backdrop-blur-md border-t border-emerald-900/10 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleSubmit}
            className="w-full bg-[#0a7a53] text-white font-bold py-3.5 rounded-full text-sm shadow-md hover:bg-[#086343] active:scale-95 transition-all"
          >
            Continue to Verify OTP →
          </button>
        </div>
      </div>
    </div>
  );
}