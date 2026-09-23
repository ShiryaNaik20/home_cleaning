export const services = [
  {
    id: 1,
    name: "SparkleClean Pro",
    price: 499,
    priceUnit: "per visit",
    availability: "Available Today",
    emoji: "🧹",
    experience: "5 years",
    badge: "Top Rated",
    description:
      "Professional home cleaning using eco-friendly products. We deep clean every corner — rooms, kitchen, and bathrooms — leaving your home spotless.",
    includes: ["Living Room", "Bedrooms", "Kitchen", "Bathrooms", "Balcony"],
  },
  {
    id: 2,
    name: "FreshNest Services",
    price: 399,
    priceUnit: "per visit",
    availability: "Available Tomorrow",
    emoji: "🏠",
    experience: "3 years",
    badge: null,
    description:
      "Affordable and reliable home cleaning tailored to your needs. Our team is trained, verified, and always on time.",
    includes: ["Living Room", "Bedrooms", "Kitchen", "Bathrooms"],
  },
  {
    id: 3,
    name: "CleanSweep Experts",
    price: 649,
    priceUnit: "per visit",
    availability: "Available Today",
    emoji: "✨",
    experience: "7 years",
    badge: "Premium",
    description:
      "Top-tier deep cleaning service with a satisfaction guarantee. Ideal for post-renovation, move-in/out, or seasonal deep cleans.",
    includes: ["All Rooms", "Kitchen", "Bathrooms", "Balcony", "Windows", "Appliances"],
  },
  {
    id: 4,
    name: "QuickMop Home Care",
    price: 299,
    priceUnit: "per visit",
    availability: "Available Today",
    emoji: "🪣",
    experience: "2 years",
    badge: "Budget Pick",
    description:
      "Quick and efficient cleaning for busy households. Perfect for regular weekly maintenance cleans at a great price.",
    includes: ["Living Room", "Bedrooms", "Kitchen"],
  },
  {
    id: 5,
    name: "HomeBright Solutions",
    price: 549,
    priceUnit: "per visit",
    availability: "Available Tomorrow",
    emoji: "💎",
    experience: "4 years",
    badge: null,
    description:
      "Comprehensive cleaning with attention to detail. We use hospital-grade disinfectants for a truly hygienic clean.",
    includes: ["All Rooms", "Kitchen", "Bathrooms", "Balcony"],
  },
  {
    id: 6,
    name: "GreenMaid Cleaning",
    price: 449,
    priceUnit: "per visit",
    availability: "Available Today",
    emoji: "🌿",
    experience: "3 years",
    badge: "Eco-Friendly",
    description:
      "100% eco-friendly cleaning products. Great for homes with kids and pets. Safe, green, and thorough.",
    includes: ["Living Room", "Bedrooms", "Kitchen", "Bathrooms"],
  },
];

export const INITIAL_REVIEWS = [
  // SparkleClean Pro (ID: 1)
  { id: 101, serviceId: 1, name: "Ananya Sharma", rating: 5, comment: "Left my home spotless! Punctual and polite staff.", date: "2026-03-10" },
  { id: 102, serviceId: 1, name: "Rahul Verma", rating: 5, comment: "Great attention to detail in the kitchen area.", date: "2026-03-14" },

  // FreshNest Services (ID: 2)
  { id: 201, serviceId: 2, name: "Priya Nair", rating: 4, comment: "Affordable and reliable. Took a bit longer than expected but good quality.", date: "2026-03-05" },
  { id: 202, serviceId: 2, name: "Vikram Singh", rating: 5, comment: "Decent work for the price. Very professional.", date: "2026-03-18" },

  // CleanSweep Experts (ID: 3)
  { id: 301, serviceId: 3, name: "Aarav Gupta", rating: 5, comment: "Worth every penny. Deep cleaned appliances and windows perfectly.", date: "2026-02-28" },
  { id: 302, serviceId: 3, name: "Sneha Patel", rating: 5, comment: "Top-tier service! Will book them again for sure.", date: "2026-03-12" },

  // QuickMop Home Care (ID: 4)
  { id: 401, serviceId: 4, name: "Rohan Das", rating: 4, comment: "Good maintenance clean for a quick weekend refresh.", date: "2026-03-01" },

  // HomeBright Solutions (ID: 5)
  { id: 501, serviceId: 5, name: "Kavita Rao", rating: 5, comment: "Everything smelled clean and sanitized without overwhelming chemical odors.", date: "2026-03-08" },

  // GreenMaid Cleaning (ID: 6)
  { id: 601, serviceId: 6, name: "Meera Joshi", rating: 5, comment: "Loved that they used eco-friendly products. Safe for my pets!", date: "2026-03-15" }
];

export const timeSlots = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
  "4:00 PM – 6:00 PM",
];