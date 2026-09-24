import { useState, useMemo } from "react";
import { INITIAL_REVIEWS } from "../data/services";

/* ── helpers ── */
function getReviews(serviceId) {
  if (!serviceId) return [];
  const saved = localStorage.getItem(`reviews_${serviceId}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse reviews from localStorage", e);
    }
  }

  // Seed initial reviews for this service if local storage is empty
  const initial = INITIAL_REVIEWS.filter(
    (r) => String(r.serviceId) === String(serviceId)
  );
  if (initial.length > 0) {
    localStorage.setItem(`reviews_${serviceId}`, JSON.stringify(initial));
  }
  return initial;
}

function saveReviews(serviceId, reviews) {
  localStorage.setItem(`reviews_${serviceId}`, JSON.stringify(reviews));
}

function StarRow({ value, onChange, size = "text-2xl", readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${size} cursor-${
            readOnly ? "default" : "pointer"
          } transition-transform ${
            !readOnly ? "hover:scale-110 active:scale-95" : ""
          }`}
          style={{ color: star <= (hovered || value) ? "#f59e0b" : "#d1d5db" }}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          onClick={() => !readOnly && onChange && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function RatingBar({ label, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-gray-500 w-4 text-right">
        {label}
      </span>
      <span className="text-amber-400 text-xs">★</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-400 w-6">{count}</span>
    </div>
  );
}

/* ── Review Form (modal-like card) ── */
export function ReviewForm({
  serviceId,
  serviceName,
  bookingId,
  userName,
  onDone,
}) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit() {
    if (rating === 0) {
      setError("Please pick a star rating.");
      return;
    }
    if (text.trim().length < 10) {
      setError("Write at least a few words (10 chars).");
      return;
    }

    const reviews = getReviews(serviceId);
    const already = reviews.find((r) => String(r.bookingId) === String(bookingId));
    if (already) {
      setError("You've already reviewed this booking.");
      return;
    }

    const review = {
      id: Date.now(),
      bookingId,
      serviceId,
      userName: userName || "Anonymous",
      rating: Number(rating),
      text: text.trim(),
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      createdAt: new Date().toISOString(),
    };

    saveReviews(serviceId, [review, ...reviews]);
    setSubmitted(true);
    setTimeout(() => onDone && onDone(), 1500);
  }

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-7 text-center animate-fadeInUp">
        <div className="text-4xl mb-2">🎉</div>
        <p className="font-bold text-[#0a7a53] text-base">
          Thanks for your review!
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Your feedback helps others choose better.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-900/5 animate-fadeInUp">
      <h3 className="font-bold text-gray-800 text-base mb-1 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-[#0a7a53] rounded-full inline-block" />
        Rate &amp; Review — {serviceName}
      </h3>
      <p className="text-xs text-gray-400 mb-4">How was your experience?</p>

      {/* Stars */}
      <div className="flex flex-col items-center gap-1 mb-5 py-3 bg-amber-50/50 rounded-2xl border border-amber-100">
        <StarRow value={rating} onChange={setRating} size="text-3xl" />
        <p className="text-xs font-semibold text-amber-700 mt-1 h-4">
          {rating === 1 && "Poor"}
          {rating === 2 && "Fair"}
          {rating === 3 && "Good"}
          {rating === 4 && "Very Good"}
          {rating === 5 && "Excellent!"}
        </p>
      </div>

      {/* Text */}
      <textarea
        rows={3}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError("");
        }}
        placeholder="Share what you liked (or didn't)…"
        className="w-full text-sm text-gray-700 border border-gray-200 rounded-2xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#0a7a53]/30 focus:border-[#0a7a53] placeholder:text-gray-300 transition"
      />

      {error && (
        <p className="text-xs text-rose-500 font-semibold mt-1.5 ml-1">
          {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        className="mt-3 w-full bg-[#0a7a53] text-white font-bold py-3.5 rounded-full text-sm shadow-sm hover:bg-[#086343] active:scale-95 transition-all"
      >
        Submit Review ✨
      </button>
    </div>
  );
}

/* ── Review List (read-only with sorting) ── */
export function ReviewList({ serviceId }) {
  const [sortBy, setSortBy] = useState("top"); // "top", "lowest", "newest"
  const rawReviews = getReviews(serviceId);

  /* Aggregate stats */
  const total = rawReviews.length;
  const avg =
    total > 0
      ? (
          rawReviews.reduce((s, r) => s + Number(r.rating || 0), 0) / total
        ).toFixed(1)
      : null;

  const dist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: rawReviews.filter((r) => Number(r.rating) === s).length,
  }));

  /* Correct immutable sort calculation */
  const sortedReviews = useMemo(() => {
    return [...rawReviews].sort((a, b) => {
      const ratingA = Number(a.rating || 0);
      const ratingB = Number(b.rating || 0);

      if (sortBy === "top") return ratingB - ratingA;
      if (sortBy === "lowest") return ratingA - ratingB;
      if (sortBy === "newest") {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(a.date || 0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(b.date || 0);
        return dateB - dateA;
      }
      return 0;
    });
  }, [rawReviews, sortBy]);

  if (total === 0) {
    return (
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-900/5">
        <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-base">
          <span className="w-1.5 h-4 bg-[#0a7a53] rounded-full inline-block" />
          Customer Reviews
        </h2>
        <div className="text-center py-8 text-gray-400">
          <div className="text-3xl mb-2">💬</div>
          <p className="text-sm font-medium">No reviews yet — be the first!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-emerald-900/5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="font-bold text-gray-800 flex items-center gap-2 text-base">
          <span className="w-1.5 h-4 bg-[#0a7a53] rounded-full inline-block" />
          Customer Reviews
          <span className="ml-1 text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {total} {total === 1 ? "review" : "reviews"}
          </span>
        </h2>

        {/* Sort Controls */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0a7a53]/20"
        >
          <option value="top">Top Rated</option>
          <option value="lowest">Lowest Rated</option>
          <option value="newest">Most Recent</option>
        </select>
      </div>

      {/* Rating summary */}
      <div className="flex gap-5 mb-5 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100/60">
        <div className="flex flex-col items-center justify-center min-w-[70px]">
          <span className="text-4xl font-extrabold text-[#0a7a53]">{avg}</span>
          <StarRow value={Math.round(Number(avg))} readOnly size="text-base" />
          <span className="text-[11px] text-gray-400 mt-0.5 font-medium">
            {total} ratings
          </span>
        </div>
        <div className="flex-1 space-y-1.5 justify-center flex flex-col">
          {dist.map(({ star, count }) => (
            <RatingBar key={star} label={star} count={count} total={total} />
          ))}
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-3">
        {sortedReviews.map((r, index) => {
          const uniqueKey = r.id || r.bookingId || `review-${index}`;
          const displayName = r.userName || r.name || "Anonymous";
          const displayText = r.text || r.comment || "";

          return (
            <div
              key={uniqueKey}
              className="bg-gray-50 rounded-2xl p-4 border border-gray-100 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#0a7a53]/10 rounded-full flex items-center justify-center text-sm font-bold text-[#0a7a53] flex-shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      {displayName}
                    </p>
                    <p className="text-[11px] text-gray-400">{r.date}</p>
                  </div>
                </div>
                <StarRow value={Number(r.rating)} readOnly size="text-sm" />
              </div>
              <p className="text-xs text-gray-600 leading-relaxed ml-10">
                {displayText}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}