# 📋 TODO - Sushi Project

> Task organizzati per priorità e tipologia.

---

## 📊 Legenda

| 🔴 CRITICO | 🟠 ALTO | 🟡 MEDIO | 🟢 BASSO |
|------------|---------|----------|----------|

---

## 📈 Progresso Sprint 3

```
Completati: 8/8 ████████████████ 100% ✅
```

---

## 🎯 SPRINT 3 - COMPLETATO! 🎉

### ⚡ Architettura & Infrastruttura

| # | Priorità | Task | File | Status |
|---|----------|------|------|--------|
| 1 | 🔴 | **Custom hook useCart** - Estrarre logica carrello in hook dedicato | `src/hooks/useCart.js` | ✅ |
| 2 | 🔴 | **Context API** - Gestione stato globale senza prop drilling | `src/context/CartContext.js`, `ThemeContext.js` | ✅ |
| 3 | 🔴 | **React Router** - Navigazione `/`, `/cart`, `/checkout` | `App.js`, `src/pages/*` | ✅ |
| 4 | 🟠 | **Pagina Checkout** - Form completo con validazione | `src/pages/CheckoutPage.js` | ✅ |
| 5 | 🟠 | **Pagina Carrello** - Vista dedicata carrello | `src/pages/CartPage.js` | ✅ |

### 🎨 UI/UX Miglioramenti

| # | Priorità | Task | File | Status |
|---|----------|------|------|--------|
| 6 | 🟠 | **Dark Mode** - Toggle tema con persistenza localStorage | `ThemeContext.js`, `App.css`, `Navbar.js` | ✅ |
| 7 | 🟡 | **Layout Component** - Wrapper con Navbar/Footer condivisi | `src/components/Layout.js` | ✅ |

### 🛠️ PWA & Performance

| # | Priorità | Task | File | Status |
|---|----------|------|------|--------|
| 8 | 🟡 | **PWA Base** - Service Worker, manifest, offline support | `public/sw.js`, `manifest.json`, `usePWA.js` | ✅ |

---

## ✅ SPRINT 2 - COMPLETATO

Tutti i 15 task del secondo sprint sono stati completati:
- ✅ Conferma ordine con modale
- ✅ Quantità max 99 per prodotto
- ✅ Descrizioni e categorie prodotti
- ✅ Filtro per categoria
- ✅ Toast notifications
- ✅ Animazioni quantità
- ✅ Loader iniziale
- ✅ Responsive cards
- ✅ Footer migliorato
- ✅ PropTypes su tutti i componenti
- ✅ Lazy loading immagini
- ✅ Meta tags SEO

---

## ✅ SPRINT 1 - COMPLETATO

Tutti i 15 task del primo sprint sono stati completati:
- ✅ Bug fixes (key, undefined, redundant code)
- ✅ localStorage persistence
- ✅ Sistema sconto progressivo
- ✅ Svuota carrello
- ✅ Badge totale pezzi
- ✅ Scroll to footer
- ✅ Estrazione prodotti in array
- ✅ Alt text accessibilità
- ✅ Estrazione stili CSS
- ✅ ARIA labels
- ✅ Hover effects

---

## 🚀 SPRINT 4 - PIANIFICATO

| # | Task | Descrizione |
|---|------|-------------|
| 1 | Backend API | Integrazione con server per ordini reali (Node.js/Express) |
| 2 | Autenticazione | Sistema login/registrazione utenti (JWT) |
| 3 | Storico ordini | Dashboard ordini passati dell'utente |
| 4 | Pagamenti online | Integrazione Stripe/PayPal |
| 5 | Gestione indirizzi | Salvataggio indirizzi multipli |
| 6 | Notifiche push | Aggiornamenti stato ordine in tempo reale |
| 7 | Admin dashboard | Pannello gestione ordini e prodotti |
| 8 | i18n | Supporto multilingua (EN, IT) |

---

## 📝 Changelog

### Sprint 3 (Completato)
- **Nuovi file creati:**
  - `src/hooks/useCart.js` - Custom hook per logica carrello
  - `src/hooks/usePWA.js` - Hook per funzionalità PWA
  - `src/context/CartContext.js` - Context per stato globale carrello
  - `src/context/ThemeContext.js` - Context per tema dark/light
  - `src/pages/HomePage.js` - Pagina home con prodotti
  - `src/pages/CartPage.js` - Pagina carrello dedicata
  - `src/pages/CheckoutPage.js` - Pagina checkout con form
  - `src/components/Layout.js` - Layout wrapper con router outlet
  - `src/components/PWAPrompt.js` - Prompt installazione PWA
  - `public/sw.js` - Service Worker per offline mode

- **File modificati:**
  - `App.js` - Refactor completo con Router e Context providers
  - `Navbar.js` - Aggiunto toggle dark mode e link carrello
  - `App.css` - 200+ linee per dark mode, checkout, PWA styles
  - `manifest.json` - Configurazione PWA completa

- **Dipendenze aggiunte:**
  - `react-router-dom` - Navigazione SPA

### Sprint 2 (Completato)
- Cart.js, App.js, Card.js, Toast.js, Navbar.js, Footer.js
- App.css con 300+ linee di stili
- index.html con Meta SEO completi
- prop-types per validazione

---

*Ultimo aggiornamento: Sprint 3 completato - Ready for production!*
