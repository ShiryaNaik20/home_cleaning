import { useNavigate } from "react-router-dom";
import { INITIAL_REVIEWS } from "../data/services";

export default function ServiceCard({ service }) {
  const navigate = useNavigate();

  // Helper to calculate dynamic rating and total reviews from localStorage / seed data
  const getReviewStats = () => {
    const saved = localStorage.getItem(`reviews_${service.id}`);
    const reviews = saved
      ? JSON.parse(saved)
      : INITIAL_REVIEWS.filter((r) => r.serviceId === Number(service.id));

    const total = reviews.length;
    const avg =
      total > 0
        ? (reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) / total).toFixed(1)
        : "0.0";

    return { avg, total };
  };

  const { avg, total } = getReviewStats();

  return (
    <div
      onClick={() => navigate(`/service/${service.id}`)}
      className="bg-white rounded-3xl p-4 border border-emerald-900/5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col sm:flex-row gap-4 items-start sm:items-center animate-fadeInUp"
    >
      {/* Service Image / Emoji Avatar Container */}
      <div className="relative w-full sm:w-28 h-28 rounded-2xl bg-[#e6f4ef] flex items-center justify-center flex-shrink-0 overflow-hidden">
        {service.image ? (
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
            {service.emoji || "🧹"}
          </span>
        )}

        {/* Badge Overlay */}
        {service.badge && (
          <span className="absolute top-2 left-2 text-[10px] bg-[#0a7a53] text-white font-bold px-2 py-0.5 rounded-full shadow-sm">
            {service.badge}
          </span>
        )}
      </div>

      {/* Main Info */}
      <div className="flex-1 w-full min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-[#0a7a53] transition-colors">
            {service.name}
          </h3>

          {/* Dynamic Rating Badge */}
          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-bold flex-shrink-0">
            <span className="text-amber-400">★</span>
            <span>{avg}</span>
          </div>
        </div>

        {/* Details / Dynamic Reviews Sub-line */}
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <span>{total > 0 ? `${total} ${total === 1 ? "review" : "reviews"}` : "Verified Provider"}</span>
          {service.experience && (
            <>
              <span className="text-gray-300">•</span>
              <span>{service.experience} exp</span>
            </>
          )}
        </div>

        {/* Included Tags */}
        {service.includes && service.includes.length > 0 && (
          <div className="flex gap-1.5 mt-2.5 flex-wrap">
            {service.includes.slice(0, 3).map((item) => (
              <span
                key={item}
                className="text-[11px] text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-full"
              >
                {item}
              </span>
            ))}
            {service.includes.length > 3 && (
              <span className="text-[11px] text-[#0a7a53] bg-[#e6f4ef] font-medium px-2 py-0.5 rounded-full">
                +{service.includes.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Price & Action Buttons */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-[#0a7a53] text-lg">₹{service.price}</span>
            <span className="text-gray-400 text-xs font-normal">/ visit</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/service/${service.id}`);
              }}
              className="px-3 py-1.5 text-xs border border-gray-200 text-gray-600 rounded-full hover:bg-emerald-50 hover:border-emerald-200 transition-all font-medium"
            >
              Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/book/${service.id}`);
              }}
              className="px-4 py-1.5 text-xs bg-[#0a7a53] text-white rounded-full hover:bg-[#086343] transition-all font-semibold shadow-sm active:scale-95"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}