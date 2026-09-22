import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Hide nav on login and booking-success pages
  const hideNav = ["/login", "/booking-success"].includes(location.pathname);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (hideNav) return null;

  // Avatar: first letter of name or 👤
  const avatarLetter = user?.name ? user.name[0].toUpperCase() : null;

  function handleLogout() {
    setDropdownOpen(false);
    logout();
    navigate("/login");
  }

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-900/5 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo — updated branding with emerald theme */}
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group text-left">
            <div className="w-9 h-9 rounded-xl bg-[#0a7a53] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <img
                src="src/assets/logo.png"
                alt="Logo"
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <span className="hidden text-base">✨</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-lg leading-tight block">TidyNest</span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide block -mt-1">Home Services</span>
            </div>
          </button>

          {/* Profile Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                if (!user) {
                  navigate("/login");
                  return;
                }
                setDropdownOpen((v) => !v);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm ${
                dropdownOpen ? "ring-2 ring-[#0a7a53] ring-offset-2" : "ring-1 ring-emerald-900/10"
              } ${
                user
                  ? user.role === "admin"
                    ? "bg-amber-500 text-white"
                    : "bg-[#0a7a53] text-white"
                  : "bg-emerald-50 text-emerald-800"
              }`}
            >
              {user ? avatarLetter : "👤"}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && user && (
              <div className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-xl border border-emerald-900/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* User info */}
                <div className="px-4 py-3 bg-[#e6f4ef]/50 border-b border-emerald-900/5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${
                        user.role === "admin" ? "bg-amber-500" : "bg-[#0a7a53]"
                      }`}
                    >
                      {avatarLetter}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          user.role === "admin"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-[#e6f4ef] text-[#0a7a53]"
                        }`}
                      >
                        {user.role === "admin" ? "🛡️ Admin" : "👤 Customer"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1.5">
                  {user.role === "user" && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/my-bookings");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#e6f4ef] hover:text-[#0a7a53] transition-colors"
                    >
                      <span>📋</span> My Bookings
                    </button>
                  )}

                  {user.role === "admin" && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/admin");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      <span>🛡️</span> Admin Panel
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#e6f4ef] hover:text-[#0a7a53] transition-colors"
                  >
                    <span>🏠</span> Home
                  </button>

                  <div className="border-t border-gray-100 my-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Floating Bottom Pill Navigation Bar — hide on admin page */}
      {location.pathname !== "/admin" && (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-emerald-900/10 px-4 py-1.5">
          <div className="flex items-center gap-2">
            {[
              { path: "/", icon: "🏠", label: "Home" },
              { path: "/my-bookings", icon: "📋", label: "Bookings" },
            ].map(({ path, icon, label }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-xs font-semibold ${
                    active
                      ? "bg-[#0a7a53] text-white shadow-md"
                      : "text-gray-500 hover:bg-[#e6f4ef] hover:text-[#0a7a53]"
                  }`}
                >
                  <span className="text-base">{icon}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}