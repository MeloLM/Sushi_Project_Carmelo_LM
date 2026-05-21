# ZenSushi — Premium React & Supabase E-Commerce Web App

> A production-ready, full-stack food ordering SPA built with React 18, Supabase Auth, PostgreSQL with Row-Level Security, and deployed on Vercel.

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://vercel.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.2-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-22c55e)](LICENSE)

---

## What is ZenSushi?

ZenSushi is a **complete, scalable e-commerce web application** for food ordering. It combines a polished consumer-facing UI with a secure backend architecture — ready to extend, white-label, or deploy commercially.

Built as a showcase of modern full-stack React development, the project covers the full product lifecycle: browsing, filtering, cart management, authenticated checkout, order tracking, and admin control — all backed by a production-grade Supabase database with Row-Level Security.

---

## Features

### Security & Authentication
- **Supabase Auth** — Email/password signup and login with session persistence
- **Row-Level Security (RLS)** — PostgreSQL-level access control on all 5 tables
- **Role-based access** — `user` and `admin` roles with policy enforcement
- **Protected Routes** — Checkout requires authentication via `ProtectedRoute` HOC

### Shopping Experience
- **Live Product Catalog** — Products fetched from Supabase with graceful local fallback
- **Smart Cart** — Quantity management, automatic bulk discounts (5% per 10 items, up to 50%)
- **Coupon System** — Validated discount codes with Supabase persistence
- **Favorites** — Per-user product bookmarking with localStorage sync
- **Advanced Filters** — Category, full-text search, price range slider, allergen exclusions
- **Product Reviews** — Star ratings + comments stored in Supabase with public read / authenticated write RLS

### UI & UX
- **Dark Mode by default** — Refined dark theme with manual light mode toggle
- **Skeleton Loading** — Smooth loading states instead of blank screens while fetching
- **Mobile-First Design** — Fully responsive, Bootstrap 5 grid system
- **PWA** — Installable on desktop and mobile, with push notification opt-in at checkout
- **Sushi Points** — Loyalty gamification (Bronze / Silver / Gold levels)
- **Toast Notifications** — Non-intrusive feedback for every user action

### Developer Experience
- **Clean Architecture** — Context API (`AuthContext`, `CartContext`, `ThemeContext`) + custom hooks
- **Supabase-ready** — Migration SQL included, RLS policies written and tested
- **Vercel Deploy** — Zero-config CI/CD via GitHub integration

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router DOM v7 |
| **State** | Context API — `AuthContext`, `CartContext`, `ThemeContext` |
| **Backend / DB** | Supabase (PostgreSQL + Auth + Storage) |
| **Styling** | Bootstrap 5, Bootstrap Icons, CSS3 |
| **PWA** | Service Worker, Web App Manifest |
| **Deploy** | Vercel (auto-deploy from GitHub `main`) |

---

## Getting Started

### Prerequisites
- Node.js >= 20
- npm >= 9
- A free [Supabase](https://supabase.com) project

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MeloLM/Sushi_Project_Carmelo_LM.git
cd Sushi_Project_Carmelo_LM-main

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# → fill in REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY

# 4. Run the database migration
# → paste supabase_migration_01.sql into Supabase SQL Editor and run it

# 5. Start the development server
npm start
```

App available at `http://localhost:3000`.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL |
| `REACT_APP_SUPABASE_ANON_KEY` | Your Supabase anon/public API key |

---

## Database Schema

All tables have **Row-Level Security enabled**. One migration file covers everything: `supabase_migration_01.sql`.

| Table | Description | RLS |
|-------|-------------|-----|
| `profiles` | Extends `auth.users` with `role` (user/admin). Auto-created on signup via trigger. | Owner read/write, admin full access |
| `products` | Menu catalog — name, price, image, category, active flag | Public read (active only), admin write |
| `orders` | Order headers — user, total, status | Owner read/insert, admin full access |
| `order_items` | Order line items — product, quantity, price snapshot | Owner read/insert, admin full access |
| `ratings` | Product reviews — stars (1–5), comment | Public read, authenticated insert (one per product) |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Dynamic auth UI — username/logout or login CTA
│   ├── ProtectedRoute.js  # Auth guard HOC
│   └── ...                # Card, Footer, Layout, ProductModal, Toast
├── context/
│   ├── AuthContext.js     # Supabase session — signIn, signUp, signOut
│   ├── CartContext.js     # Cart state, discounts, coupon, sushi points
│   └── ThemeContext.js    # Dark / light mode toggle
├── hooks/
│   ├── useProducts.js     # Fetch products from Supabase with local fallback
│   ├── useRatings.js      # Per-product and global ratings from Supabase
│   ├── useCoupon.js       # Coupon validation + Supabase persistence
│   └── useSushiPoints.js  # Loyalty points and level system
├── lib/
│   └── supabase.js        # Supabase client (initialized from env vars)
├── pages/
│   ├── HomePage.js        # Menu, filters, skeleton loading
│   ├── CartPage.js        # Cart review, coupon, delivery estimate
│   ├── CheckoutPage.js    # Delivery form, order confirmation, points earn
│   ├── LoginPage.js       # Auth — sign in
│   ├── RegisterPage.js    # Auth — sign up
│   └── NotFoundPage.js    # 404
├── App.js                 # Root — providers, routing
└── App.css                # Global styles, dark mode, animations
```

---

## Roadmap

| Phase | Status | Scope |
|-------|--------|-------|
| Sprint 1–4 | ✅ Done | Foundation, UI components, PWA, UX polish |
| Phase 1 — Schema & Auth | ✅ Done | Supabase DB schema, RLS policies, Auth setup |
| Phase 2 — Auth UI | ✅ Done | Login, Register, ProtectedRoute, Navbar auth |
| **Phase 3 — DB Products** | 🔄 In progress | Products fetched from Supabase, cart refactor |
| Phase 4 — Orders & Admin | ⏳ Planned | Order persistence, order history, admin dashboard |

> See [TODO.md](./TODO.md) for the full task breakdown.

---

## Author

**Carmelo La Mantia**
- GitHub: [@MeloLM](https://github.com/MeloLM)
- Email: carmelo.la.mantia00@gmail.com

---

*Built with precision and a passion for clean architecture.*
