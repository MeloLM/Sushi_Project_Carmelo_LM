# 📋 sushi-project-tracker

> **Stato Progetto**: 🔄 In corso (Fase 3 iniziata)
> **Versione Corrente**: 0.6.0 (Data-Driven Products)
> **Prossimo Obiettivo**: Popolare tabella `products` su Supabase

---

## 🗺️ Roadmap Backend: Supabase Integration

---

### Fase 1: Supabase Schema & Auth
> **Stato**: ✅ Completata

- [x] Eseguire `supabase_migration_01.sql` nel pannello SQL di Supabase
- [x] Refactoring tabella `ratings`: FK verso `products.id` e `auth.users.id`, RLS completo
- [x] Abilitare Supabase Auth (Email/Password provider)
- [x] Configurare variabili d'ambiente su `.env.local` e Vercel
- [x] `@supabase/supabase-js` v2 installato e configurato
- [x] `src/lib/supabase.js` creato con il client inizializzato
- [x] RLS verificato e attivo su tutte le tabelle

---

### Fase 2: Frontend Auth UI
> **Stato**: ✅ Completata

- [x] `AuthContext.js` con `session`, `user`, `signIn`, `signUp`, `signOut`
- [x] `LoginPage.js` — form email/password con spinner e gestione errori
- [x] `RegisterPage.js` — con validazione conferma password
- [x] `ProtectedRoute.js` — `/checkout` richiede autenticazione
- [x] `Navbar.js` — username + logout se loggato, "Accedi" se anonimo
- [x] Fix dark mode: rimossa logica duplicata da `CartContext`
- [x] Dark mode come default all'avvio (senza persistenza localStorage)

---

### Fase 3: CartContext Refactoring (Prodotti da DB)
> **Stato**: 🔄 In corso

- [x] Creare `src/hooks/useProducts.js` — fetch da Supabase con fallback locale
- [x] Refactoring `CartContext.js` — `quantities` map al posto di array con quantità embedded
- [x] `HomePage.js` — `isLoading` reale da Supabase (rimosso fake timer), skeleton loading integrato
- [x] Skeleton loading durante il fetch dei prodotti (no flickering, no blank screen)
- [ ] **Popolare la tabella `products`** su Supabase con i 6 prodotti attuali
- [ ] Aggiungere immagini su Supabase Storage e aggiornare `image_url` nel DB

---

### Fase 4: Orders & Admin Dashboard
> **Stato**: ⏳ Futuro

- [ ] Al checkout, salvare l'ordine in `orders` e i dettagli in `order_items`
- [ ] Creare pagina `OrderHistoryPage.js` per l'utente (lista ordini personali)
- [ ] Creare pagina `AdminDashboardPage.js` (solo `role = 'admin'`)
- [ ] Admin: visualizzare tutti gli ordini con filtri per status
- [ ] Admin: CRUD prodotti dal pannello
- [ ] Supabase Realtime per aggiornamenti ordine live

---

## 🛠️ Backlog Idee Future

- [ ] **Multi-lingua**: Supporto i18n (IT/EN)
- [ ] **Pagamenti Reali**: Integrazione Stripe/PayPal
- [ ] **Notifiche Push**: Avvisi stato ordine
- [ ] **App Mobile**: Versione React Native

---

## 📜 Storico Sprint (Completati)

<details>
<summary><b>🛒 Fase 3: Data-Driven Products (Maggio 2026)</b></summary>
<br>

**3/5 Task Completati** 🔄
- **useProducts.js**: fetch da Supabase, fallback automatico ai prodotti locali se tabella vuota
- **CartContext refactor**: stato carrello ora è una `quantities` map `{[id]: qty}` — più leggero e corretto
- **HomePage**: `isLoading` reale da Supabase, rimosso il fake timer da 500ms

</details>

<details>
<summary><b>🔐 Fase 2: Frontend Auth UI (Maggio 2026)</b></summary>
<br>

**8/8 Task Completati** ✅
- AuthContext, LoginPage, RegisterPage, ProtectedRoute
- Navbar auth dinamica
- Fix dark mode conflict (CartContext vs ThemeContext)

</details>

<details>
<summary><b>🚀 Sprint 4: Frontend UX/UI (Gennaio 2026)</b></summary>
<br>

**15/15 Task Completati** ✅
- NotFoundPage, HomePage search+skeleton, CartPage confirm modal
- Favoriti, stima consegna, breadcrumbs, animazioni, tooltips, allergeni

</details>

<details>
<summary><b>⚡ Sprint 3: Core Architecture</b></summary>

- Context API, React Router, PWA Service Worker, custom hooks

</details>

<details>
<summary><b>🎨 Sprint 2: UI Components</b></summary>

- Responsive design, Toast, Loader, Footer, Navbar

</details>

<details>
<summary><b>🧱 Sprint 1: Foundation</b></summary>

- Setup React, logica carrello, localStorage, styling base

</details>
