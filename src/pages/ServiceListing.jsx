import { useState, useMemo } from "react";
import { services } from "../data/services";
import ServiceCard from "../components/ServiceCard";

export default function ServiceListing() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterAvailability, setFilterAvailability] = useState("all");

  const filtered = useMemo(() => {
    let list = [...services];
    if (search.trim()) {
      list = list.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterAvailability === "today") {
      list = list.filter((s) => s.availability === "Available Today");
    }
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "price_low") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_high") list.sort((a, b) => b.price - a.price);
    return list;
  }, [search, sortBy, filterAvailability]);

  return (
    <div className="bg-[#f2f6f4] min-h-screen pb-28">
      {/* Hero Header */}
      <div className="bg-[#0a7a53] text-white px-6 pt-8 pb-12 rounded-b-[2.5rem] shadow-md">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">Welcome Back</p>
              <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight mt-1">
                Trusted Home Services<br />at Your Fingertips
              </h1>
            </div>
            <span className="hidden sm:inline-block bg-white/10 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md">
              {services.length} Verified Pros
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative pt-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search services, cleaners, plumbers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-full text-sm bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 space-y-6">
        {/* Quick Advantage Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "🛡️", label: "Verified", sub: "Staff" },
            { icon: "⚡", label: "Same Day", sub: "Available" },
            { icon: "🔄", label: "Free", sub: "Re-clean" },
          ].map(({ icon, label, sub }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-3 text-center shadow-sm border border-emerald-900/5 hover:shadow-md transition-shadow"
            >
              <div className="text-xl mb-0.5">{icon}</div>
              <p className="text-xs font-bold text-gray-800">{label}</p>
              <p className="text-[10px] text-gray-400 font-medium">{sub}</p>
            </div>
          ))}
        </div>

        {/* Promo Banner Card */}
        <div className="bg-[#0a7a53] text-white rounded-3xl p-5 relative overflow-hidden flex items-center justify-between shadow-sm">
          <div className="space-y-1.5 z-10 max-w-[65%]">
            <span className="bg-emerald-800/80 text-emerald-200 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full">
              Limited Offer
            </span>
            <h3 className="text-base sm:text-lg font-bold leading-tight">Smart Home Service</h3>
            <p className="text-xs text-emerald-100">Get quality repair & cleaning at best prices</p>
          </div>
          <div className="bg-emerald-400/20 text-emerald-100 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-300/30">
            30% OFF
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {/* Sorting Pill Toggle */}
          <button
            onClick={() =>
              setSortBy((current) =>
                current === "rating"
                  ? "price_low"
                  : current === "price_low"
                  ? "price_high"
                  : "rating"
              )
            }
            className="text-xs px-4 py-2 rounded-full border font-semibold transition-all whitespace-nowrap bg-white text-gray-700 border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm"
          >
            {sortBy === "rating" && "⭐ Top Rated"}
            {sortBy === "price_low" && "💰 Price: Low to High"}
            {sortBy === "price_high" && "💎 Price: High to Low"}
          </button>

          {/* Availability Filter Pill */}
          <button
            onClick={() => setFilterAvailability((v) => (v === "today" ? "all" : "today"))}
            className={`text-xs px-4 py-2 rounded-full font-semibold transition-all whitespace-nowrap border shadow-sm ${
              filterAvailability === "today"
                ? "bg-[#0a7a53] text-white border-[#0a7a53]"
                : "bg-white text-gray-700 border-gray-200 hover:bg-emerald-50"
            }`}
          >
            🟢 Available Today
          </button>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="font-bold text-gray-800 text-base">
            {filterAvailability === "today" ? "Available Today" : "Top Professionals"}
          </h2>
          <span className="text-xs text-[#0a7a53] bg-[#e6f4ef] font-bold px-2.5 py-1 rounded-full">
            {filtered.length} pros available
          </span>
        </div>

        {/* Service Cards List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-emerald-900/5">
            <p className="text-4xl mb-3">😕</p>
            <p className="text-gray-700 font-bold">No services found</p>
            <p className="text-gray-400 text-xs mt-1">Try updating your search query or filter</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}