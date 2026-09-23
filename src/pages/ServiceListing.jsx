import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { services } from "../data/services";
import ServiceCard from "../components/ServiceCard";

export default function ServiceListing() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [filterAvailability, setFilterAvailability] = useState("all");

  const navigate = useNavigate();

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

    if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price_low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_high") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [search, sortBy, filterAvailability]);

  return (
    <div className="bg-[#f2f6f4] min-h-screen pb-28">
      {/* Header */}
      <div className="bg-[#0a7a53] text-white px-6 pt-8 pb-7 rounded-b-[2.5rem] shadow-md">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider font-poppins">
                Welcome Back
              </p>

              <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight mt-1 font-sekuya">
                Trusted Home Services
                <br />
                at Your Fingertips
              </h1>
            </div>

            <span className="hidden sm:inline-block bg-white/10 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md font-poppins">
              {services.length} Verified Pros
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search services, cleaners, plumbers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-full text-sm bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all placeholder:text-gray-400 font-poppins"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-7 space-y-5">
        {/* Trust Features */}
        <div className="grid grid-cols-3 gap-3 stagger">
          {[
            { icon: "🛡️", label: "Verified", sub: "Staff" },
            { icon: "⚡", label: "Same Day", sub: "Available" },
            { icon: "🔄", label: "Free", sub: "Re-clean" },
          ].map(({ icon, label, sub }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-3 text-center shadow-sm border border-emerald-900/5 hover:shadow-md transition-shadow animate-fadeInUp"
            >
              <div className="text-xl mb-0.5">{icon}</div>

              <p className="text-xs font-bold text-gray-800 font-montserrat">
                {label}
              </p>

              <p className="text-[10px] text-gray-400 font-medium font-poppins">
                {sub}
              </p>
            </div>
          ))}
        </div>

        {/* Smart Home Promo Banner */}
        <button
          type="button"
          onClick={() => navigate("/service/1")}
          className="w-full bg-[#0a7a53] text-white rounded-3xl p-5 relative overflow-hidden flex items-center justify-between shadow-sm animate-fadeInUp text-left cursor-pointer hover:shadow-lg hover:bg-[#086343] transition-all duration-200 active:scale-[0.99]"
        >
          <div className="space-y-1.5 z-10 max-w-[65%]">
            <span className="inline-block bg-emerald-800/80 text-emerald-200 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full font-poppins">
              Limited Offer
            </span>

            <h3 className="text-base sm:text-lg font-bold leading-tight font-montserrat">
              SparkleClean Pro
            </h3>

            <p className="text-xs text-emerald-100 font-poppins">
              Get quality repair & cleaning at best prices
            </p>
          </div>

          <div className="bg-emerald-400/20 text-emerald-100 font-bold text-xs px-3 py-1.5 rounded-full border border-emerald-300/30 font-poppins">
            30% OFF
          </div>
        </button>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none animate-fadeInUp">
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
            className="text-xs px-4 py-2 rounded-full border font-semibold transition-all whitespace-nowrap bg-white text-gray-700 border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm font-poppins"
          >
            {sortBy === "rating" && "⭐ Top Rated"}
            {sortBy === "price_low" && "💰 Price: Low to High"}
            {sortBy === "price_high" && "💎 Price: High to Low"}
          </button>

          <button
            onClick={() =>
              setFilterAvailability((v) =>
                v === "today" ? "all" : "today"
              )
            }
            className={`text-xs px-4 py-2 rounded-full font-semibold transition-all whitespace-nowrap border shadow-sm font-poppins ${
              filterAvailability === "today"
                ? "bg-[#0a7a53] text-white border-[#0a7a53]"
                : "bg-white text-gray-700 border-gray-200 hover:bg-emerald-50"
            }`}
          >
            🟢 Available Today
          </button>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between pt-1 animate-fadeInUp">
          <h2 className="font-bold text-gray-800 text-base font-montserrat">
            {filterAvailability === "today"
              ? "Available Today"
              : "Top Professionals"}
          </h2>

          <span className="text-xs text-[#0a7a53] bg-[#e6f4ef] font-bold px-2.5 py-1 rounded-full font-poppins">
            {filtered.length} pros available
          </span>
        </div>

        {/* Service Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-emerald-900/5 animate-fadeIn">
            <p className="text-4xl mb-3">😕</p>

            <p className="text-gray-700 font-bold font-montserrat">
              No services found
            </p>

            <p className="text-gray-400 text-xs mt-1 font-poppins">
              Try updating your search or filter
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 stagger">
            {filtered.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}