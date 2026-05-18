# 🍣 Sushi Project

> **Experience the art of Sushi ordering.**
> Una Single Page Application (SPA) moderna, reattiva e progressiva (PWA) per ordinare il tuo sushi preferito.

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?logo=supabase)](https://supabase.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.2.3-7952B3?logo=bootstrap)](https://getbootstrap.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-purple?logo=pwa)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green)]()

---

## 🌟 Highlights

- **🔐 Autenticazione Reale**: Login e registrazione con Supabase Auth (email/password). Route protette e session management.
- **📱 Progressive Web App (PWA)**: Installabile su desktop e mobile, funziona anche offline.
- **🎨 Modern UI/UX**: Design responsivo, Dark Mode predefinita, animazioni fluide e skeleton loading.
- **🛒 Smart Cart**: Persistenza dati, calcolo sconti automatici, stima consegna e gestione favoriti ❤️.
- **⚡ Performance**: Lazy loading, ottimizzazione immagini e codice modulare.

---

## 📸 Screenshots

| Desktop Home | Dark Mode | Mobile PWA |
|--------------|-----------|------------|
| ![Desktop](https://placehold.co/600x400?text=Home+Page+Preview) | ![Dark Mode](https://placehold.co/600x400/1a1a2e/FFF?text=Dark+Mode+Preview) | ![Mobile](https://placehold.co/300x500?text=Mobile+View) |

---

## ✨ Funzionalità

### 🔐 Autenticazione
- **Login / Registrazione**: Form con validazione, feedback errori e spinner di caricamento.
- **Session Management**: Stato utente globale via `AuthContext`, sincronizzato con Supabase.
- **Route Protette**: `/checkout` accessibile solo agli utenti autenticati (`ProtectedRoute`).
- **Navbar Dinamica**: Mostra username e tasto logout se loggato, tasto "Accedi" se anonimo.

### 🛍️ Esperienza d'Acquisto
- **Catalogo Ricco**: Filtri per categoria (Roll, Nigiri, Special) e ricerca testuale istantanea.
- **Dettagli Prodotto**: Icone allergeni (🦐, 🥜, 🥛) per ogni piatto.
- **Carrello Avanzato**: Modifica quantità, rimuovi item, svuota tutto (con conferma di sicurezza).

### ⚙️ Core Features
- **Routing**: Navigazione SPA fluida (`/`, `/cart`, `/checkout`, `/login`, `/register`) con React Router.
- **State Management**: Gestione globale tramite Context API (`AuthContext`, `CartContext`, `ThemeContext`).
- **Persistenza**: Carrello e preferiti salvati in `localStorage`.
- **Feedback Utente**: Toast notifications, tooltip informativi e pagina 404 personalizzata.

---

## 🛠️ Tech Stack

| Area | Tecnologia |
|------|------------|
| **Frontend Core** | React 18, Hooks (Custom & Built-in) |
| **State** | React Context API (`AuthContext`, `CartContext`, `ThemeContext`) |
| **Backend / Auth** | Supabase (Auth, PostgreSQL, RLS) |
| **Styling** | Bootstrap 5, CSS3 Custom Properties |
| **Routing** | React Router DOM v7 |
| **PWA** | Service Worker, Manifest.json |
| **Icons** | Bootstrap Icons |

---

## 🚀 Installazione & Avvio

### Prerequisiti
- Node.js >= 14
- npm >= 6
- Account Supabase (gratuito)

### Quick Start
```bash
# 1. Clona il repository
git clone https://github.com/MeloLM/Sushi_Project_Carmelo_LM.git

# 2. Entra nella cartella
cd Sushi_Project_Carmelo_LM-main

# 3. Installa le dipendenze
npm install

# 4. Configura le variabili d'ambiente
cp .env.example .env.local
# → inserisci REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY

# 5. Esegui la migrazione DB (una volta sola)
# → copia supabase_migration_01.sql nel pannello SQL di Supabase ed eseguilo

# 6. Avvia l'app
npm start
```

L'app sarà disponibile su `http://localhost:3000`.

---

## 📁 Struttura Progetto

```
src/
├── components/
│   ├── Navbar.js          # Navbar con auth dinamica (login/logout)
│   ├── ProtectedRoute.js  # HOC per route protette
│   └── ...                # Card, Footer, Layout, ecc.
├── context/
│   ├── AuthContext.js     # Sessione utente Supabase
│   ├── CartContext.js     # Stato carrello e prodotti
│   └── ThemeContext.js    # Dark/Light mode
├── hooks/                 # Custom Hooks (useSushiPoints, useRatings, ecc.)
├── lib/
│   └── supabase.js        # Client Supabase inizializzato
├── pages/
│   ├── LoginPage.js       # Pagina accesso
│   ├── RegisterPage.js    # Pagina registrazione
│   └── ...                # Home, Cart, Checkout, 404
├── App.js                 # Main Entry, Routing & Providers
└── App.css                # Global Styling & Animations
```

---

## 🗄️ Database (Supabase)

Schema PostgreSQL con Row Level Security attivo su tutte le tabelle:

| Tabella | Descrizione |
|---------|-------------|
| `profiles` | Estende `auth.users` con campo `role` (user/admin) |
| `products` | Catalogo prodotti del menu |
| `orders` | Ordini con status (`pending` → `delivered`) |
| `order_items` | Righe di dettaglio per ogni ordine |
| `ratings` | Recensioni prodotti (lettura pubblica, scrittura autenticata) |

---

## 🗺️ Roadmap

> Vedi [TODO.md](./TODO.md) per il dettaglio completo dei task.

| Sprint | Stato | Focus |
|--------|-------|-------|
| Sprint 1-4 | ✅ Completato | Foundation, UI, PWA, UX |
| Fase 1 – Schema & Auth | 🔄 In corso | Supabase DB, RLS, Auth setup |
| Fase 2 – Auth UI | ✅ Completato | Login, Register, ProtectedRoute, Navbar |
| Fase 3 – Prodotti da DB | ⏳ Prossimo | CartContext refactor, fetch prodotti |
| Fase 4 – Orders & Admin | ⏳ Futuro | Storico ordini, Admin Dashboard |

---

## 👤 Autore

**Carmelo La Mantia**
- 🐙 GitHub: [@MeloLM](https://github.com/MeloLM)
- 📧 Email: carmelo.la.mantia00@gmail.com

---

Made with ❤️ and 🍣 by Carmelo.
