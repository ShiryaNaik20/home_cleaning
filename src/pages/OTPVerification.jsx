import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CORRECT_OTP = "1234";

export default function OTPVerification() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const pending = JSON.parse(sessionStorage.getItem("pendingBooking") || "null");

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  function handleChange(index, value) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError("");
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  }

  function handleVerify() {
    const entered = otp.join("");
    if (entered.length < 4) {
      setError("Please enter the 4-digit OTP.");
      return;
    }
    if (entered !== CORRECT_OTP) {
      setError("Incorrect OTP. Try again.");
      setOtp(["", "", "", ""]);
      inputRefs[0].current?.focus();
      return;
    }

    setLoading(true);

    // Save booking to localStorage
    setTimeout(() => {
      const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      const newBooking = {
        id: Date.now(),
        ...pending,
        status: "Confirmed",
        bookedAt: new Date().toISOString(),
      };
      bookings.unshift(newBooking);
      localStorage.setItem("bookings", JSON.stringify(bookings));
      sessionStorage.removeItem("pendingBooking");
      navigate("/booking-success", { replace: true });
    }, 1200);
  }

  function handleResend() {
    setResendTimer(30);
    setOtp(["", "", "", ""]);
    setError("");
    inputRefs[0].current?.focus();
  }

  if (!pending) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-slate-500 text-sm hover:text-slate-700 mb-8"
      >
        ← Back
      </button>

      <div className="text-center">
        <div className="text-5xl mb-4">📱</div>
        <h1 className="text-xl font-bold text-slate-800">Verify Your Number</h1>
        <p className="text-sm text-slate-500 mt-2">
          We sent a 4-digit OTP to{" "}
          <span className="font-semibold text-slate-700">+91 {pending.phone}</span>
        </p>
        <p className="text-xs text-blue-500 mt-1 bg-blue-50 inline-block px-3 py-1 rounded-full">
          Demo OTP: 1234
        </p>
      </div>

      {/* OTP Boxes */}
      <div className="flex gap-3 justify-center mt-8">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={inputRefs[i]}
            type="tel"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-14 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-colors ${
              error
                ? "border-red-400 bg-red-50 text-red-600"
                : digit
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-slate-50 text-slate-800"
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mt-3">{error}</p>
      )}

      {/* Resend */}
      <div className="text-center mt-4">
        {resendTimer > 0 ? (
          <p className="text-xs text-slate-400">
            Resend OTP in <span className="font-semibold text-slate-600">{resendTimer}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-blue-600 text-sm font-medium"
          >
            Resend OTP
          </button>
        )}
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full mt-8 bg-blue-600 text-white font-semibold py-3.5 rounded-xl text-base disabled:opacity-60 transition-colors shadow-lg shadow-blue-200"
      >
        {loading ? "Verifying…" : "Verify & Confirm Booking"}
      </button>
    </div>
  );
}