# TidyNest — Home Cleaning Booking Module

A focused mini booking flow built. This is a single-service slice (Home Cleaning) of a super-app demonstrating end-to-end booking UX, form validation, mock OTP verification, booking management, and a basic admin/ops view.

---

Open `https://home-cleaning-kappa.vercel.app/` in your browser.

### Demo Credentials
| Role  | Phone / Email | OTP / Password  |
|-------|---------------|------|
| User  | Any 10-digit number | `1234` |
| Admin | Use the "Admin" login option on the login screen | `admin123` |

---

##  Stack & Why

| Layer | Choice | Reason |
|-------|--------|--------|
| UI | React 18 + Vite | Fast dev setup, component model suits a multi-screen booking flow |
| Styling | Tailwind CSS | Utility-first made it easy to build a consistent mobile-first UI quickly without a design system |
| Routing | React Router v6 | Clean declarative routing; `<Navigate>` made auth guards simple |
| State | React `useState` + Context | No need for a heavy state library at this scope; AuthContext handles the single shared concern |
| Persistence | `localStorage` | Meets "persists for the session" requirement without needing a backend — bookings survive a refresh |

I chose this stack because it's what I'm most productive in and lets me focus on UX quality and code structure within the 1–2 day scope of the assignment.

---

##  Features Built

### Core
- **Service Listing** : 6 mock cleaning providers with search, sort (Top Rated / Price Low–High / Price High–Low), and availability filter (Available Today)
- **Service Detail** : Provider info, what's included, pricing, and reviews; "Book Now" CTA
- **Booking Form** : Captures name, 10-digit Indian phone (validated with regex), address, date (blocked in the past), and time slot picker. Inline real-time error states on every field.
- **OTP Verification** : 4-digit input with auto-focus, backspace navigation, 30s resend timer, and loading state on verify. Mock OTP: `1234`.

### Nice-to-Have (both completed)
- **My Bookings** : Lists all bookings with status badges (Confirmed / Completed / Cancelled), a progress stepper, cancel action, and a post-service review flow.
- **Admin Panel** : Ops view with booking counts by status, filter by status, and the ability to advance booking status (Confirmed → Completed). Role-protected : only accessible when logged in as admin.

---

##  Project Structure

```
src/
├── components/
│   ├── Navbar.jsx        # Bottom nav + role-aware links
│   ├── ServiceCard.jsx   # Reusable card for listing page
│   └── Reviews.jsx       # Review display + review form
├── context/
│   └── AuthContext.jsx   # Auth state (user + role) via Context API
├── data/
│   └── services.js       # Mock service data, reviews, and time slots
├── pages/
│   ├── Login.jsx         # Mock login with role selection
│   ├── ServiceListing.jsx
│   ├── ServiceDetail.jsx
│   ├── BookingForm.jsx
│   ├── OTPVerification.jsx
│   ├── BookingSuccess.jsx
│   ├── MyBookings.jsx
│   └── Admin.jsx
└── App.jsx               # Routes + auth guards (RequireAuth, RequireAdmin)
```

---

## 🔮 What I'd Improve with More Time

1. **Real backend** : Replace localStorage with an API (Node/Express or Laravel) and a proper DB (MySQL / MongoDB) so bookings persist across devices and users.
2. **Rating aggregation** : Compute average service rating from reviews dynamically and surface it on the listing page; the current "sort by rating" defaults to static order.
3. **Date/time conflict detection** : Prevent double-booking the same provider on the same slot.
4. **Push/SMS notifications** : Integrate a real OTP service (Twilio / MSG91) and booking status change notifications.
5. **Tests** : Add unit tests for the validation logic and component-level tests with React Testing Library.
6. **Animations polish** : The fade-in CSS animations work well on mobile; with more time I'd refine them for reduced-motion accessibility.



## 💡 Assumptions Made

- A single service category (Home Cleaning) is sufficient to demonstrate the full flow as the assignment asks to "pick ONE."
- No real SMS/OTP integration needed — the mock OTP `1234` is displayed on-screen per the assignment spec.
- "Responsive" is interpreted as mobile-first (375px+), matching the target Flutter mobile app context.
- Auth is mocked (no real user DB) — login simply selects a user/admin role and stores it in localStorage.
