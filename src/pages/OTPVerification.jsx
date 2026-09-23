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

  useEffect(() => { inputRefs[0].current?.focus(); }, []);

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
    if (value && index < 3) inputRefs[index + 1].current?.focus();
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  }

  function handleVerify() {
    const entered = otp.join("");
    if (entered.length < 4) { setError("Please enter the 4-digit OTP."); return; }
    if (entered !== CORRECT_OTP) {
      setError("Incorrect OTP. Please try again.");
      setOtp(["", "", "", ""]);
      inputRefs[0].current?.focus();
      return;
    }
    setLoading(true);
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

  if (!pending) { navigate("/"); return null; }

  return (
    <div className="bg-[#f2f6f4] min-h-screen pb-24">
      {/* Hero Header — matches other pages */}
      <div className="bg-[#0a7a53] text-white px-4 pt-6 pb-12 rounded-b-[2.5rem] shadow-md">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white mb-4 transition-all"
          >
            ←
          </button>
          <h1 className="text-white text-2xl font-bold">Verify Your Number</h1>
          <p className="text-emerald-100 text-sm mt-1 font-medium">
            OTP sent to <span className="font-bold">+91 {pending.phone}</span>
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="max-w-md mx-auto px-4 -mt-6 animate-fadeInUp">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-900/5">

          {/* Phone icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#e6f4ef] rounded-full flex items-center justify-center mx-auto text-3xl animate-checkPop">
              📱
            </div>
            <p className="text-xs text-[#0a7a53] font-semibold mt-3 bg-[#e6f4ef] inline-block px-3 py-1 rounded-full">
              Demo OTP: 1234
            </p>
          </div>

          {/* OTP Boxes */}
          <div className="flex gap-3 justify-center mb-4">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-14 h-14 text-center text-xl font-bold border-2 rounded-2xl focus:outline-none transition-all ${
                  error
                    ? "border-red-400 bg-red-50 text-red-600"
                    : digit
                    ? "border-[#0a7a53] bg-[#e6f4ef]/60 text-[#0a7a53]"
                    : "border-gray-200 bg-gray-50 text-gray-800 focus:border-[#0a7a53] focus:ring-2 focus:ring-emerald-200"
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4 font-medium animate-fadeIn">
              ⚠️ {error}
            </p>
          )}

          {/* Resend */}
          <div className="text-center mb-6">
            {resendTimer > 0 ? (
              <p className="text-xs text-gray-400">
                Resend OTP in <span className="font-semibold text-gray-600">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-[#0a7a53] text-sm font-semibold hover:underline transition-all"
              >
                Resend OTP
              </button>
            )}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-[#0a7a53] hover:bg-[#086343] text-white font-bold py-3.5 rounded-full text-sm shadow-md shadow-emerald-200 disabled:opacity-60 active:scale-95 transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Verifying…
              </span>
            ) : (
              "Verify & Confirm Booking →"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}