# 📋 sushi-project-tracker

> **Stato Progetto**: 🔄 In corso (Fase 2 Completata)
> **Versione Corrente**: 0.5.0 (Supabase Auth Integration)
> **Prossimo Obiettivo**: Fase 3 – Prodotti da DB

---

## 🗺️ Roadmap Backend: Supabase Integration

---

### Fase 1: Supabase Schema & Auth
> **Stato**: 🔄 In corso

- [ ] Eseguire `supabase_migration_01.sql` nel pannello SQL di Supabase (tabelle `profiles`, `products`, `orders`, `order_items`, `ratings`)
- [x] Refactoring tabella `ratings`: FK verso `products.id` e `auth.users.id`, CHECK `stars` IN (1–5), RLS con lettura pubblica e write ristretta al proprietario
- [x] Abilitare Supabase Auth (Email/Password provider) dal pannello Dashboard
- [x] Configurare variabili d'ambiente: `REACT_APP_SUPABASE_URL` e `REACT_APP_SUPABASE_ANON_KEY` in `.env.local`
- [x] Installare e configurare il client Supabase: `@supabase/supabase-js` v2
- [x] Creare `src/lib/supabase.js` con il client inizializzato
- [ ] Verificare RLS attivo su tutte le tabelle e testare le policy con un utente admin e uno normale

---

### Fase 2: Frontend Auth UI
> **Stato**: ✅ Completata

- [x] Creare `AuthContext.js` con `session`, `user`, `signIn`, `signUp`, `signOut`
- [x] Creare pagina `LoginPage.js` (form email/password con spinner e gestione errori)
- [x] Creare pagina `RegisterPage.js` (con validazione conferma password)
- [x] Proteggere le route private con `ProtectedRoute` (`/checkout` richiede login)
- [x] Mostrare username e tasto logout in `Navbar.js` se loggato, "Accedi" se anonimo
- [x] Fix conflitto dark mode: rimossa logica duplicata da `CartContext`, ora gestita solo da `ThemeContext`
- [x] Dark mode impostata come default all'avvio (senza persistenza localStorage)
- [ ] Sostituire `device_id` locale con `auth.uid()` di Supabase ovunque nel codice

---

### Fase 3: CartContext Refactoring (Prodotti da DB)
> **Stato**: ⏳ Futuro

- [ ] Creare hook `useProducts.js` che fetch i prodotti dalla tabella `products` via Supabase
- [ ] Rimuovere i prodotti hardcoded da `CartContext.js`
- [ ] Gestire loading/error state durante il fetch dei prodotti
- [ ] Popolare la tabella `products` in Supabase con i dati attuali (migrazione dati)
- [ ] Aggiungere immagini su Supabase Storage e aggiornare `image_url` nel DB

---

### Fase 4: Orders & Admin Dashboard
> **Stato**: ⏳ Futuro

- [ ] Al checkout, salvare l'ordine in `orders` e i dettagli in `order_items`
- [ ] Creare pagina `OrderHistoryPage.js` per l'utente (lista ordini personali)
- [ ] Creare pagina `AdminDashboardPage.js` (accessibile solo a `role = 'admin'`)
- [ ] Admin: visualizzare tutti gli ordini con filtri per status
- [ ] Admin: CRUD prodotti (aggiungere, modificare, disattivare piatti dal menu)
- [ ] Implementare aggiornamento real-time degli ordini con Supabase Realtime

---

## 🛠️ Backlog Idee Future

- [ ] **Multi-lingua**: Supporto i18n (IT/EN)
- [ ] **Pagamenti Reali**: Integrazione Stripe/PayPal
- [ ] **Notifiche Push**: Avvisi stato ordine
- [ ] **App Mobile**: Versione React Native (futuro)

---

## 📜 Storico Sprint (Completati)

<details open>
<summary><b>🔐 Fase 2: Frontend Auth UI (Maggio 2026)</b></summary>
<br>

**7/8 Task Completati** ✅
- **AuthContext**: Session management con Supabase `onAuthStateChange`
- **LoginPage / RegisterPage**: Form con validazione, spinner, redirect automatico
- **ProtectedRoute**: HOC per proteggere `/checkout`
- **Navbar**: Auth dinamica (username + logout / "Accedi")
- **Fix**: Conflitto dark mode tra `CartContext` e `ThemeContext` risolto
- **Fix**: Dark mode impostata come default all'avvio

</details>

<details>
<summary><b>🚀 Sprint 4: Frontend UX/UI (Gennaio 2026)</b></summary>
<br>

**15/15 Task Completati** ✅
- **Pages**: `NotFoundPage` (404), `HomePage` (Search, Skeleton), `CartPage` (Confirm Modal)
- **Features**: Sistema Favoriti ❤️, Stima Consegna ⏱️, Breadcrumbs 🗺️
- **UI**: Animazioni CSS ✨, ScrollToTop ⬆️, Tooltips 💡, Badge Categoria 🏷️
- **Data**: Allergeni 🦐, Meta Titles dinamici 📝

</details>

<details>
<summary><b>⚡ Sprint 3: Core Architecture</b></summary>

- **Refactor**: Context API per Cart e Theme
- **Routing**: Setup React Router base
- **PWA**: Service Worker e installazione
- **Structure**: Hooks custom (`useCart`, `usePWA`)

</details>

<details>
<summary><b>🎨 Sprint 2: UI Components</b></summary>

- Responsive Design
- Toast Notifications
- Loader iniziale
- Footer e Navbar migliorati

</details>

<details>
<summary><b>🧱 Sprint 1: Foundation</b></summary>

- Setup progetto React
- Logica base carrello
- LocalStorage persistence
- Styling base Bootstrap

</details>
