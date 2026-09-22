import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_PASSWORD = "admin123";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";

    const [role, setRole] = useState("user");
    const [form, setForm] = useState({ name: "", phone: "", password: "" });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    function handleChange(field, value) {
        setForm((f) => ({ ...f, [field]: value }));
        if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    }

    function handleUserLogin() {
        const e = {};
        if (!form.name.trim()) e.name = "Please enter your name.";
        if (!form.phone.trim()) e.phone = "Please enter your phone number.";
        else if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit number.";
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        login({ name: form.name.trim(), phone: form.phone, role: "user" });
        navigate(from, { replace: true });
    }

    function handleAdminLogin() {
        const e = {};
        if (!form.password) e.password = "Password is required.";
        else if (form.password !== ADMIN_PASSWORD) e.password = "Incorrect password. Try admin123.";
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        login({ name: "Admin", role: "admin" });
        navigate("/admin", { replace: true });
    }

    return (
        /* Outer: full screen bg, centers the mobile card */
        <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">

            {/* Mobile card — fixed width, rounded all around, clips content */}
            <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col">

                {/* Top gradient section */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-center px-6 pt-10 pb-10">
                    {/* Logo */}
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg overflow-hidden">
                        <img
                            src="/src/assets/logo.png"
                            alt="TidyNest Logo"
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.parentElement.innerHTML =
                                    '<span style="font-size:28px">🧹</span>';
                            }}
                        />
                    </div>
                    <h1 className="text-white text-2xl font-bold">TidyNest</h1>
                    <p className="text-blue-200 text-sm mt-1">Your trusted home cleaning partner</p>
                </div>

                {/* White bottom section */}
                <div className="bg-white px-5 pt-6 pb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome back 👋</h2>
                    <p className="text-gray-400 text-sm mb-5">Sign in to continue</p>

                    {/* Role Toggle */}
                    <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                        {[
                            { key: "user", icon: "👤", label: "Customer" },
                            { key: "admin", icon: "🛡️", label: "Admin" },
                        ].map(({ key, icon, label }) => (
                            <button
                                key={key}
                                onClick={() => { setRole(key); setErrors({}); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                    role === key ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"
                                }`}
                            >
                                {icon} {label}
                            </button>
                        ))}
                    </div>

                    {role === "user" ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Rahul Sharma"
                                    value={form.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                                        errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                                    }`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">⚠️ {errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Mobile Number
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex items-center px-3 border border-gray-200 bg-gray-100 rounded-xl text-sm text-gray-600 font-medium whitespace-nowrap">
                                        🇮🇳 +91
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="9876543210"
                                        value={form.phone}
                                        onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                                        className={`flex-1 px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                                            errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                                        }`}
                                    />
                                </div>
                                {errors.phone && <p className="text-red-500 text-xs mt-1">⚠️ {errors.phone}</p>}
                            </div>

                            <button
                                onClick={handleUserLogin}
                                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-blue-200"
                            >
                                Sign In as Customer →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex items-start gap-2">
                                <span className="text-orange-500 mt-0.5">🛡️</span>
                                <div>
                                    <p className="text-xs font-semibold text-orange-700">Admin Access Only</p>
                                    <p className="text-xs text-orange-500 mt-0.5">
                                        This panel is for TidyNest operations staff only.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Admin Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter admin password"
                                        value={form.password}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        className={`w-full px-4 py-3 pr-12 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                                            errors.password ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">⚠️ {errors.password}</p>}
                                <p className="text-xs text-gray-400 mt-1">Hint: admin123</p>
                            </div>

                            <button
                                onClick={handleAdminLogin}
                                className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-indigo-200"
                            >
                                Sign In as Admin →
                            </button>
                        </div>
                    )}

                    <p className="text-center text-xs text-gray-400 mt-6">
                        By signing in, you agree to our Terms & Privacy Policy
                    </p>
                </div>

            </div>
        </div>
    );
}