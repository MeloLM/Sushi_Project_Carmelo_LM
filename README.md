# 🍣 ZenSushi

> **Order smarter. Taste better.** — A full-stack food ordering SPA + PWA built with React 18, Supabase, and Bootstrap 5. From à-la-carte browsing to fully custom Party Box configurations, all under an elegant dark-mode UI.

[![Version](https://img.shields.io/badge/version-0.6.0-ffc107?style=flat-square)](CHANGELOG.md)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_+_DB_+_Storage-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)

---

## 📌 Overview

**ZenSushi** is a production-ready, full-stack ordering platform for a sushi delivery brand. The app covers the full customer journey — from browsing the menu and managing a cart to configuring bespoke Party Boxes and completing a secure, authenticated checkout.

The architecture is built around three pillars:

- **React 18 SPA** with Context API for decoupled, scalable state management
- **Supabase** as a serverless backend (Auth, PostgreSQL with RLS, Storage CDN)
- **Progressive Web App** — installable on any device, with push notifications

---

## ✨ Key Features

### 🔐 Authentication & Security

- **Supabase Auth** — Email/password signup and login with automatic JWT session persistence
- **Database triggers** — A PostgreSQL trigger on `auth.users` auto-provisions a `profiles` row on every new signup, setting a default `user` role
- **Row-Level Security (RLS)** — Every table enforces access policies at the database level (see [Architecture & Security](#architecture--security))
- **Protected Routes** — The checkout flow is gated behind a `<ProtectedRoute>` HOC; unauthenticated users are redirected to `/login`

### 🛒 Shopping Experience

- **Live Product Catalog** — Menu fetched from Supabase with a graceful local-fallback for offline or error states
- **À-la-carte Menu** — Full-text search, category tabs (Roll / Nigiri / Special), price-range slider, and per-allergen exclusion filters
- **Smart Cart** — Quantity management with automatic tiered discounts (5% per 10 items, capped at 50%) and coupon-code support
- **Product Ratings** — Star ratings and comments stored in Supabase; public read, authenticated write, one review per user per product
- **Favorites** — Per-session product bookmarking with localStorage sync
- **Sushi Points** — Loyalty gamification system: Bronze → Silver → Gold levels based on order history

### 🎊 Party Box Configurator *(v0.6.0)*

A multi-step, guided UX for building a fully custom sushi assortment:

1. **Step 1 — Choose a size**: Three Bootstrap pricing cards with feature lists and a "Most popular" badge
   | Size | Pieces | Price |
   |------|--------|-------|
   | 📦 Piccola | 20 pz | €25 |
   | 🎁 Media | 50 pz | €55 |
   | 🎊 Grande | 80 pz | €85 |
2. **Step 2 — Compose portions**: A responsive card grid where the user increments/decrements portion counts. A live progress bar (info → warning → danger → success) reflects the fill level; the CTA unlocks only when the box is exactly full.

### 🖼️ UI & UX

- **Dark Mode** — Deep, immersive dark theme with Bootstrap 5 utility classes; manual light-mode toggle available
- **Responsive Grid** — Mobile-first Bootstrap 5 layout with product cards featuring high-quality imagery, category badges, ingredient descriptions, and intuitive `+`/`−` quantity controls
- **Skeleton Loading** — Smooth placeholder states replace blank screens during Supabase fetches
- **Toast Notifications** — Non-blocking feedback for every user action
- **PWA** — Full service worker, Web App Manifest, installable on desktop and mobile, push notification opt-in at checkout

---

## 🏗️ Architecture & Security

```
Browser (React SPA + PWA)
       │
       ├── Context API ──── AuthContext   (Supabase session, signIn/signUp/signOut)
       │                ├── CartContext   (quantities, discounts, coupon, Sushi Points)
       │                └── ThemeContext  (dark / light toggle)
       │
       └── Supabase ──────── Auth         (JWT, session refresh)
                        ├── PostgreSQL    (5 tables, RLS on every row)
                        └── Storage       (public image CDN bucket)
```

### Row-Level Security Policy Summary

All five tables have RLS **enabled and enforced**. No query reaches a row unless a matching policy grants it:

| Table | Public Read | Authenticated Write | Admin Full Access |
|-------|:-----------:|:-------------------:|:-----------------:|
| `products` | Active rows only | ✗ | ✅ |
| `profiles` | ✗ | Own row only | ✅ |
| `orders` | ✗ | Own rows | ✅ |
| `order_items` | ✗ | Own rows | ✅ |
| `ratings` | ✅ | One per product | ✅ |

Admin identity is determined by the `role` column in `profiles`, set at registration or via a Supabase dashboard update. All policy checks reference `auth.uid()` — credentials never flow through the frontend.

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Navbar.js              # Dynamic auth UI — user info + logout, or login CTA
│   ├── PartyBoxConfigurator.js# Multi-step Party Box builder (pricing cards → composer)
│   ├── ProtectedRoute.js      # Auth guard HOC
│   ├── Card.js                # Product card — image, badge, allergens, qty controls
│   └── ...                    # Breadcrumb, Footer, Layout, ProductModal, Toast
├── context/
│   ├── AuthContext.js         # Supabase session management
│   ├── CartContext.js         # Cart state, discounts, coupon, Sushi Points
│   └── ThemeContext.js        # Dark / light mode
├── hooks/
│   ├── useProducts.js         # Supabase product fetch + local fallback
│   ├── useRatings.js          # Per-product and aggregate ratings
│   ├── useCoupon.js           # Coupon validation with Supabase persistence
│   └── useSushiPoints.js      # Loyalty level system
├── lib/
│   └── supabase.js            # Supabase client (env-var initialised)
├── pages/
│   ├── HomePage.js            # Hero CTA + à-la-carte menu with filters
│   ├── BoxBuilderPage.js      # /box-builder route wrapper
│   ├── CartPage.js            # Cart review, coupon input, delivery estimate
│   ├── CheckoutPage.js        # Delivery form, order persistence, points earn
│   ├── LoginPage.js / RegisterPage.js
│   └── NotFoundPage.js
├── App.js                     # Root — providers, router, document title hook
└── App.css                    # Global styles, dark theme, skeleton animations
```

---

## 🚀 Local Setup

### Prerequisites

- Node.js ≥ 20
- npm ≥ 9
- A free [Supabase](https://supabase.com) project

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MeloLM/Sushi_Project_Carmelo_LM.git
cd Sushi_Project_Carmelo_LM-main

# 2. Install dependencies
npm install

# 3. Configure environment variables (see below)
cp .env.example .env.local   # or create .env.local manually

# 4. Apply the database schema
# Open Supabase → SQL Editor → paste & run supabase_migration_01.sql

# 5. Start the development server
npm start
# → http://localhost:3000
```

### Environment Variables

Create a `.env.local` file at the project root:

```env
# .env.local — never commit this file
REACT_APP_SUPABASE_URL=https://<your-project-ref>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<your-anon-public-key>
```

Both values are available in your Supabase dashboard under **Project Settings → API**.

> ⚠️ The anon key is safe to expose in the browser **only because RLS policies restrict what it can access**. Never use the `service_role` key on the frontend.

---

## 🗺️ Roadmap

| Sprint | Status | Deliverables |
|--------|--------|--------------|
| **1** | ✅ Complete | Project scaffold, React Router, Bootstrap dark theme, PWA manifest |
| **2** | ✅ Complete | Cart Context, coupon system, Sushi Points, Toast notifications |
| **3** | ✅ Complete | Supabase Auth + RLS, product catalog, ratings, checkout flow |
| **4** | ✅ Complete | Party Box Configurator (3 sizes, 2-step UX), Hero section, `/box-builder` route |
| **5** | ⏳ Planned | Realtime order tracking (Supabase WebSocket), PWA offline cache (IndexedDB), Code Splitting (`React.lazy` + `Suspense`), Image optimisation via Supabase Storage WebP transforms |

> Full task breakdown: [TODO.md](./TODO.md)

---

## 🧑‍💻 Author

**Carmelo La Mantia**

[![GitHub](https://img.shields.io/badge/@MeloLM-181717?style=flat-square&logo=github)](https://github.com/MeloLM)
[![Email](https://img.shields.io/badge/carmelo.la.mantia00@gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:carmelo.la.mantia00@gmail.com)

---

*Built with precision, dark mode, and a healthy obsession with clean architecture.*

