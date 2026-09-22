import { useParams, useNavigate } from "react-router-dom";
import { services } from "../data/services";

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = services.find((s) => s.id === Number(id));

  if (!service)
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-3">😕</p>
        <p className="text-gray-700 font-bold text-lg">Service not found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-5 py-2.5 bg-[#0a7a53] text-white rounded-full text-xs font-semibold shadow-sm hover:bg-[#086343] transition-all"
        >
          ← Go back to home
        </button>
      </div>
    );

  return (
    <div className="bg-[#f2f6f4] min-h-screen pb-36">
      {/* Hero Header */}
      <div className="bg-[#0a7a53] text-white px-4 pt-6 pb-12 rounded-b-[2.5rem] shadow-md relative">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white mb-4 transition-all"
          >
            ←
          </button>
          <div className="text-center">
            <div className="w-20 h-20 bg-white/15 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl mx-auto mb-3 shadow-inner border border-white/10">
              {service.emoji || "🧹"}
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{service.name}</h1>
              {service.badge && (
                <span className="text-xs bg-emerald-100 text-[#0a7a53] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {service.badge}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="text-amber-300 text-base">★</span>
              <span className="font-bold text-white text-sm">{service.rating || "4.8"}</span>
              <span className="text-emerald-100 text-xs font-medium">({service.reviews || 0} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-3xl mx-auto px-4 -mt-6 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: `₹${service.price}`, label: service.priceUnit || "Per Visit", color: "text-[#0a7a53]" },
            { value: service.experience || "5+ Yrs", label: "Experience", color: "text-gray-800" },
            {
              value: service.availability ? service.availability.replace("Available ", "") : "Today",
              label: "Availability",
              color: "text-[#0a7a53]",
            },
          ].map(({ value, label, color }) => (
            <div
              key={label}
              className="bg-white rounded-2xl p-3 text-center shadow-sm border border-emerald-900/5 hover:shadow-md transition-shadow"
            >
              <p className={`font-bold text-sm sm:text-base ${color}`}>{value}</p>
              <p className="text-gray-400 text-[11px] mt-0.5 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* About Service Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-900/5">
          <h2 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-base">
            <span className="w-1.5 h-4 bg-[#0a7a53] rounded-full inline-block" />
            About Service
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {service.description || "Professional service provided by background-verified experts."}
          </p>
        </div>

        {/* What's Included */}
        {service.includes && service.includes.length > 0 && (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-900/5">
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-base">
              <span className="w-1.5 h-4 bg-[#0a7a53] rounded-full inline-block" />
              What's Included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.includes.map((item) => (
                <div key={item} className="flex items-center gap-2.5 bg-[#e6f4ef]/60 rounded-2xl px-3.5 py-2.5">
                  <span className="w-4 h-4 bg-[#0a7a53] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </span>
                  <span className="text-xs text-gray-700 font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust & Guarantee */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-900/5">
          <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-base">
            <span className="w-1.5 h-4 bg-[#0a7a53] rounded-full inline-block" />
            Why Choose Us
          </h2>
          <div className="space-y-3">
            {[
              ["🛡️", "Verified & background-checked staff"],
              ["💰", "Transparent pricing, no hidden charges"],
              ["🔄", "Free re-clean guarantee if unsatisfied"],
              ["📞", "24/7 dedicated customer support"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#e6f4ef] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-base">{icon}</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-600 font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-emerald-900/10 px-4 py-3.5">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400">Total Rate</p>
            <p className="font-bold text-[#0a7a53] text-xl">₹{service.price}</p>
          </div>
          <button
            onClick={() => navigate(`/book/${service.id}`)}
            className="flex-1 max-w-md bg-[#0a7a53] text-white font-bold py-3.5 rounded-full text-sm shadow-md hover:bg-[#086343] active:scale-95 transition-all text-center"
          >
            Book Now →
          </button>
        </div>
      </div>
    </div>
  );
}