import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const ADMIN_PASSWORD = "admin123";

const FEATURES = [
  {
    icon: "🛡️",
    title: "Verified Professionals",
    desc: "Every cleaner is background-checked & trained",
  },
  {
    icon: "⚡",
    title: "Same-Day Availability",
    desc: "Book and get service as early as today",
  },
  {
    icon: "🔄",
    title: "Free Re-clean Guarantee",
    desc: "Not satisfied? We'll redo it at no cost",
  },
  {
    icon: "📞",
    title: "24 / 7 Support",
    desc: "Our team is always here to help you",
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [role, setRole] = useState("user");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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

  function handleUserLogin() {
    const e = {};

    if (!form.name.trim()) {
      e.name = "Please enter your name.";
    }

    if (!form.phone.trim()) {
      e.phone = "Please enter your phone number.";
    } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
      e.phone = "Enter a valid 10-digit number.";
    }

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    login({
      name: form.name.trim(),
      phone: form.phone,
      role: "user",
    });

    navigate(from, {
      replace: true,
    });
  }

  function handleAdminLogin() {
    const e = {};

    if (!form.password) {
      e.password = "Password is required.";
    } else if (form.password !== ADMIN_PASSWORD) {
      e.password = "Incorrect password. Try admin123.";
    }

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    login({
      name: "Admin",
      role: "admin",
    });

    navigate("/admin", {
      replace: true,
    });
  }

  return (
    <div className="min-h-screen bg-[#f2f6f4] flex flex-col lg:flex-row">

      {/* ════════════════════════════════════════
          LEFT PANEL — Desktop Only
      ════════════════════════════════════════ */}

      <div className="hidden lg:flex lg:w-[52%] bg-gradient-to-br from-[#0a7a53] to-[#054d35] flex-col justify-between px-14 py-12 relative overflow-hidden flex-shrink-0">

        {/* Decorative background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full pointer-events-none" />

        <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />

        <div className="absolute top-1/2 right-8 w-48 h-48 bg-emerald-400/10 rounded-full pointer-events-none" />

        {/* Brand */}
        <div className="flex items-center gap-3 z-10 animate-fadeInUp">

          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">

            <img
              src={logo}
              alt="TidyNest"
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<span style="font-size:22px">🧹</span>';
              }}
            />

          </div>

          <div>
            <span className="font-sekuya text-white text-2xl leading-tight block">
              TidyNest
            </span>

            <span className="text-emerald-200 text-xs font-poppins">
              Home Services
            </span>
          </div>

        </div>

        {/* Hero copy */}
        <div
          className="z-10 animate-fadeInUp"
          style={{ animationDelay: "80ms" }}
        >

          <h1 className="font-sekuya text-white text-4xl xl:text-5xl leading-tight mb-5">
            Clean Homes,
            <br />
            Happy Lives
          </h1>

          <p className="text-emerald-100 text-base font-poppins leading-relaxed max-w-sm">
            India's most trusted platform for professional home cleaning.
            Book in minutes, relax all day.
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-5">

            {FEATURES.map(({ icon, title, desc }, i) => (
              <div
                key={title}
                className="flex items-start gap-4 animate-fadeInUp"
                style={{
                  animationDelay: `${160 + i * 80}ms`,
                }}
              >

                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                  {icon}
                </div>

                <div>
                  <p className="text-white font-semibold text-sm font-montserrat">
                    {title}
                  </p>

                  <p className="text-emerald-200 text-xs font-poppins mt-0.5">
                    {desc}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>

        {/* Footer tagline */}
        <p className="text-emerald-300/60 text-xs font-poppins z-10">
          Trusted by 10,000+ households across India
        </p>

      </div>

      {/* ════════════════════════════════════════
          RIGHT PANEL
      ════════════════════════════════════════ */}

      <div className="flex-1 flex flex-col">

        {/* ── Mobile-only green header ── */}

        <div className="lg:hidden bg-gradient-to-br from-[#0a7a53] to-[#065e3f] text-center px-6 pt-12 pb-12 rounded-b-[2.5rem] shadow-lg">

          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden animate-checkPop">

            <img
              src={logo}
              alt="TidyNest"
              className="w-14 h-14 object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<span style="font-size:32px">🧹</span>';
              }}
            />

          </div>

          <h1 className="text-white text-3xl font-sekuya">
            TidyNest
          </h1>

          <p className="text-emerald-200 text-sm mt-2 font-poppins">
            Your trusted home cleaning partner
          </p>

          {/* Mini feature pills */}
          <div className="flex justify-center gap-2 mt-5 flex-wrap">

            {[
              "🛡️ Verified",
              "⚡ Same Day",
              "🔄 Free Re-clean",
            ].map((f) => (
              <span
                key={f}
                className="text-[11px] bg-white/15 text-white px-3 py-1 rounded-full font-poppins border border-white/20"
              >
                {f}
              </span>
            ))}

          </div>

        </div>

        {/* ── Form area ── */}

        <div className="flex-1 flex flex-col lg:justify-center px-5 pt-8 pb-10 lg:px-14 xl:px-20 bg-white lg:bg-[#f2f6f4]">

          <div className="w-full max-w-md mx-auto animate-fadeInUp">

            {/* Greeting */}
            <div className="mb-7">

              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-montserrat">
                Welcome back 👋
              </h2>

              <p className="text-gray-400 text-sm mt-1.5 font-poppins">
                Sign in to manage your bookings
              </p>

            </div>

            {/* Role Toggle */}
            <div className="flex bg-[#f2f6f4] lg:bg-white rounded-xl p-1 mb-6 border border-gray-100 shadow-sm">

              {[
                {
                  key: "user",
                  icon: "👤",
                  label: "Customer",
                },
                {
                  key: "admin",
                  icon: "🛡️",
                  label: "Admin",
                },
              ].map(({ key, icon, label }) => (

                <button
                  key={key}
                  onClick={() => {
                    setRole(key);
                    setErrors({});
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all font-poppins ${
                    role === key
                      ? "bg-[#0a7a53] text-white shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {icon} {label}
                </button>

              ))}

            </div>

            {/* ════════════════════════════════════════
                CUSTOMER FORM
            ════════════════════════════════════════ */}

            {role === "user" ? (

              <div className="space-y-5 animate-fadeInUp">

                {/* Name */}
                <div>

                  <label className="block text-xs font-semibold text-gray-500 mb-2 font-poppins">
                    Full Name
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={(e) =>
                      handleChange("name", e.target.value)
                    }
                    className={`w-full px-4 py-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all font-poppins ${
                      errors.name
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />

                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1.5 font-poppins">
                      ⚠️ {errors.name}
                    </p>
                  )}

                </div>

                {/* Phone */}
                <div>

                  <label className="block text-xs font-semibold text-gray-500 mb-2 font-poppins">
                    Mobile Number
                  </label>

                  <div className="flex gap-2">

                    <div className="flex items-center px-3.5 border border-gray-200 bg-gray-100 rounded-xl text-sm text-gray-600 font-semibold whitespace-nowrap font-poppins">
                      🇮🇳 +91
                    </div>

                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={form.phone}
                      onChange={(e) =>
                        handleChange(
                          "phone",
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10)
                        )
                      }
                      className={`flex-1 px-4 py-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all font-poppins ${
                        errors.phone
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    />

                  </div>

                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1.5 font-poppins">
                      ⚠️ {errors.phone}
                    </p>
                  )}

                </div>

                <button
                  onClick={handleUserLogin}
                  className="w-full bg-[#0a7a53] hover:bg-[#086343] text-white font-bold py-4 rounded-xl text-sm shadow-lg shadow-emerald-200 active:scale-95 transition-all font-poppins mt-2"
                >
                  Sign In as Customer →
                </button>

              </div>

            ) : (

              /* ════════════════════════════════════════
                  ADMIN FORM
              ════════════════════════════════════════ */

              <div className="space-y-5 animate-fadeInUp">

                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-4 flex items-start gap-3">

                  <span className="text-amber-500 text-xl mt-0.5">
                    🛡️
                  </span>

                  <div>

                    <p className="text-sm font-semibold text-amber-700 font-montserrat">
                      Admin Access Only
                    </p>

                    <p className="text-xs text-amber-500 mt-0.5 font-poppins">
                      Restricted to TidyNest operations staff only.
                    </p>

                  </div>

                </div>

                <div>

                  <label className="block text-xs font-semibold text-gray-500 mb-2 font-poppins">
                    Admin Password
                  </label>

                  <div className="relative">

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={form.password}
                      onChange={(e) =>
                        handleChange("password", e.target.value)
                      }
                      className={`w-full px-4 py-4 pr-12 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all font-poppins ${
                        errors.password
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((v) => !v)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-base"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>

                  </div>

                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1.5 font-poppins">
                      ⚠️ {errors.password}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-1.5 font-poppins">
                    Hint: admin123
                  </p>

                </div>

                <button
                  onClick={handleAdminLogin}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl text-sm shadow-lg shadow-amber-200 active:scale-95 transition-all font-poppins mt-2"
                >
                  Sign In as Admin →
                </button>

              </div>

            )}

            {/* Terms */}
            <p className="text-center text-xs text-gray-400 mt-8 font-poppins">

              By signing in, you agree to our{" "}

              <span className="text-[#0a7a53] font-medium cursor-pointer hover:underline">
                Terms
              </span>

              {" & "}

              <span className="text-[#0a7a53] font-medium cursor-pointer hover:underline">
                Privacy Policy
              </span>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}