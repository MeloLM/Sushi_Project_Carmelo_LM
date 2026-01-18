# 🏗️ ARCHITECTURE.md - Guida Tecnica per Sviluppatori

> Documento destinato a sviluppatori e AI agents che devono orientarsi nel progetto, modificare funzionalità esistenti o aggiungerne di nuove.

---

## 📑 Indice

1. [Mappa del File System](#mappa-del-file-system)
2. [Design Pattern Utilizzati](#design-pattern-utilizzati)
3. [Flusso Dati](#flusso-dati)
4. [Routing & Navigazione](#routing--navigazione)
5. [Context API & State Management](#context-api--state-management)
6. [Convenzioni di Codice](#convenzioni-di-codice)
7. [Componenti: Specifiche Tecniche](#componenti-specifiche-tecniche)
8. [Custom Hooks](#custom-hooks)
9. [PWA & Service Worker](#pwa--service-worker)
10. [Dipendenze & Configurazioni](#dipendenze--configurazioni)
11. [Guida alle Modifiche](#guida-alle-modifiche)

---

## 📁 Mappa del File System

```
Sushi_Project_Carmelo_LM-main/
│
├── 📄 package.json              # Dipendenze npm e script di build
├── 📄 README.md                 # Documentazione utente/overview
├── 📄 ARCHITECTURE.md           # Questo file - documentazione tecnica
├── 📄 TODO.md                   # Task list e sprint tracking
│
├── 📂 public/                   # Asset statici serviti direttamente
│   ├── index.html              # Template HTML root (mount point React)
│   ├── manifest.json           # Configurazione PWA (metadata app)
│   ├── robots.txt              # Direttive per crawler SEO
│   └── sw.js                   # Service Worker per PWA/offline
│
└── 📂 src/                      # Codice sorgente applicazione
    │
    ├── 📄 index.js              # ⭐ ENTRY POINT - Bootstrap React + CSS
    ├── 📄 index.css             # Reset CSS e font-family base
    ├── 📄 App.js                # ⭐ ROOT COMPONENT - Router + Providers
    ├── 📄 App.css               # Stili globali + Dark Mode + PWA
    ├── 📄 App.test.js           # Test unitari (Create React App default)
    ├── 📄 setupTests.js         # Configurazione Jest
    ├── 📄 reportWebVitals.js    # Metriche performance (CRA default)
    │
    ├── 📂 components/           # Componenti React riutilizzabili
    │   ├── Card.js             # Card prodotto singolo (presentational)
    │   ├── Cart.js             # Modale carrello con totali
    │   ├── Footer.js           # Footer con form feedback
    │   ├── Layout.js           # Layout wrapper con Navbar/Footer
    │   ├── Navbar.js           # Header con logo, dark mode, cart link
    │   ├── PWAPrompt.js        # Prompt installazione PWA
    │   └── Toast.js            # Notifiche toast
    │
    ├── 📂 context/              # React Context per stato globale
    │   ├── CartContext.js      # Context carrello + prodotti + toast
    │   └── ThemeContext.js     # Context tema dark/light
    │
    ├── 📂 hooks/                # Custom React Hooks
    │   ├── useCart.js          # Logica carrello estratta
    │   └── usePWA.js           # Gestione PWA/Service Worker
    │
    ├── 📂 pages/                # Pagine/Route dell'applicazione
    │   ├── HomePage.js         # Home con griglia prodotti e filtri
    │   ├── CartPage.js         # Pagina carrello dedicata
    │   └── CheckoutPage.js     # Form checkout con validazione
    │
    └── 📂 images/               # Asset grafici
        ├── california.png      # Immagine roll California
        ├── dragon.png          # Immagine roll Dragon
        ├── dynamite.png        # Immagine roll Dynamite
        ├── philadelphia.png    # Immagine roll Whitey
        ├── rainbow.png         # Immagine roll Rainbow
        ├── shrimp.png          # Immagine roll Fungi
        ├── sushi.png           # Logo navbar
        └── sushi_bg.jpg        # Background pagina principale
```

### Legenda Responsabilità

| Cartella/File | Responsabilità | Modificare per... |
|---------------|----------------|-------------------|
| `src/App.js` | Router + Provider setup | Aggiungere nuove route |
| `src/context/` | Stato globale | Modificare logica business |
| `src/pages/` | Pagine/Views | Modificare layout pagine |
| `src/components/` | UI components | Modificare aspetto visivo |
| `src/hooks/` | Logica riutilizzabile | Estrarre nuova logica |
| `src/images/` | Asset grafici | Aggiungere nuove immagini |
| `src/App.css` | Stili globali | Modificare tema, dark mode |
| `public/sw.js` | Service Worker | Modificare caching strategy |

---

## 🎨 Design Pattern Utilizzati

### 1. Context Provider Pattern (Sprint 3)

**Nuova architettura con Context API:**

```
┌──────────────────────────────────────────────────────────────────┐
│                         APP.JS                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    ThemeProvider                            │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │                  CartProvider                         │  │  │
│  │  │  ┌────────────────────────────────────────────────┐  │  │  │
│  │  │  │              BrowserRouter                      │  │  │  │
│  │  │  │                   │                             │  │  │  │
│  │  │  │              <Routes>                           │  │  │  │
│  │  │  │                   │                             │  │  │  │
│  │  │  │         ┌─────────┼─────────┐                   │  │  │  │
│  │  │  │         ▼         ▼         ▼                   │  │  │  │
│  │  │  │    HomePage   CartPage  CheckoutPage            │  │  │  │
│  │  │  └────────────────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### 2. Custom Hooks Pattern

Logica estratta in hooks riutilizzabili:
- `useCart` - Gestione carrello
- `usePWA` - Funzionalità PWA

```javascript
// Uso in qualsiasi componente
const { cards, incrementItem, totalQuantity } = useCartContext();
const { darkMode, toggleDarkMode } = useTheme();
```

### 3. Compound Components (Layout)

Layout wrapper che compone Navbar, Footer, Toast:

```javascript
// Layout.js
<div className='bg_cstm'>
  <Navbar />
  <main>
    <Outlet />  {/* React Router outlet */}
  </main>
  <Footer />
  <Toast />
  <PWAPrompt />
</div>
```

### 4. Container/Presentational Pattern (Legacy)

Ancora usato per componenti semplici come Card.js:

```
┌─────────────────────────────────────────────────────────────┐
│ CONTEXT CONSUMERS (ricevono da Context)                      │
│  HomePage, CartPage, CheckoutPage, Navbar                    │
└─────────────────────────────┬───────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  PRESENTATIONAL │  │  PRESENTATIONAL │  │  PRESENTATIONAL │
│    Card.js      │  │   Footer.js     │  │    Toast.js     │
│                 │  │                 │  │                 │
│   Props → UI    │  │   Props → UI    │  │   Props → UI    │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 🚀 Routing & Navigazione

### Struttura Route

```javascript
// App.js
<Router>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
    </Route>
  </Routes>
</Router>
```

### Mappa Route

| Path | Componente | Descrizione |
|------|------------|-------------|
| `/` | `HomePage` | Griglia prodotti con filtri categoria |
| `/cart` | `CartPage` | Visualizzazione carrello dedicata |
| `/checkout` | `CheckoutPage` | Form ordine con validazione |

### Navigazione Programmatica

```javascript
import { useNavigate, Link } from 'react-router-dom';

// Link dichiarativo
<Link to="/cart">Vai al Carrello</Link>

// Navigazione programmatica
const navigate = useNavigate();
navigate('/checkout');
```

---

## 🗃️ Context API & State Management

### CartContext

**File:** `src/context/CartContext.js`

**Valori esposti:**
```javascript
{
  // Prodotti
  cards,              // Array tutti i prodotti
  cartItems,          // Solo prodotti nel carrello (quantita > 0)
  initialProducts,    // Prodotti iniziali per reset
  
  // Azioni
  incrementItem,      // (card) => void
  decrementItem,      // (card) => void
  resetCart,          // () => void
  
  // Totali calcolati
  totalQuantity,      // Numero totale pezzi
  totalPrice,         // Prezzo lordo
  discountPercent,    // % sconto applicato (5% ogni 10 pezzi)
  discountAmount,     // Valore sconto in €
  finalPrice,         // Prezzo finale con sconto
  maxQuantity,        // Limite max per prodotto (99)
  
  // Toast
  toast,              // { show, message, type }
  showToast,          // (message, type) => void
}
```

**Uso:**
```javascript
import { useCartContext } from '../context/CartContext';

const MyComponent = () => {
  const { cards, incrementItem, totalQuantity } = useCartContext();
  // ...
};
```

### ThemeContext

**File:** `src/context/ThemeContext.js`

**Valori esposti:**
```javascript
{
  darkMode,           // boolean
  toggleDarkMode,     // () => void
  theme               // 'dark' | 'light'
}
```

**Uso:**
```javascript
import { useTheme } from '../context/ThemeContext';

const MyComponent = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  // ...
};
```

---

## 🔄 Flusso Dati (Aggiornato Sprint 3)

### Diagramma Flusso con Context

```
┌──────────────────────────────────────────────────────────────────┐
│                    CONTEXT PROVIDERS                              │
│                                                                    │
│  ┌─────────────────────┐    ┌─────────────────────┐              │
│  │    CartContext      │    │   ThemeContext      │              │
│  │  ───────────────    │    │  ────────────────   │              │
│  │  cards[]            │    │  darkMode: boolean  │              │
│  │  incrementItem()    │    │  toggleDarkMode()   │              │
│  │  decrementItem()    │    │                     │              │
│  │  resetCart()        │    │                     │              │
│  │  totalQuantity      │    │                     │              │
│  │  finalPrice         │    │                     │              │
│  └──────────┬──────────┘    └──────────┬──────────┘              │
│             │                          │                          │
└─────────────┼──────────────────────────┼──────────────────────────┘
              │                          │
              │    useCartContext()      │    useTheme()
              │                          │
    ┌─────────┼──────────────────────────┼─────────┐
    │         │                          │         │
    ▼         ▼                          ▼         ▼
┌────────┐ ┌────────┐ ┌──────────┐ ┌────────┐ ┌────────┐
│HomePage│ │CartPage│ │Checkout  │ │ Navbar │ │ Layout │
│        │ │        │ │  Page    │ │        │ │        │
└────────┘ └────────┘ └──────────┘ └────────┘ └────────┘
```

### Ciclo di Vita Interazione Utente

```
1. USER CLICK [+] button in Card (HomePage)
         │
         ▼
2. Card.js invoca props.onIncrement(card)
         │
         ▼
3. HomePage passa incrementItem da useCartContext()
         │
         ▼
4. CartContext.incrementItem() aggiorna cards state
         │
         ▼
5. localStorage sincronizzato via useEffect
         │
         ▼
6. React re-renders tutti i consumer del context
         │
         ▼
7. Navbar badge, CartPage totali, tutto aggiornato
```
   └────┬────┘            └────┬────┘           └───────────┘
        │                      │
        │ onClick()            │ Calcola:
        │                      │ - totalQuantity
        ▼                      │ - totalPrice
   Invoca callback             │
   props.onIncrement()         ▼
   props.onDecrement()    Renderizza lista
        │                 e totali
        │
        └────────────────────────┐
                                 │
                                 ▼
                    State update triggers re-render
```

### Ciclo di Vita Interazione Utente

```
1. USER CLICK [+] button in Card.js
         │
         ▼
2. Card.js invoca props.onIncrement(card)
         │
         ▼
3. App.js handleIncrement() eseguito
         │
         ▼
4. setCard(newCards) aggiorna state
         │
         ▼
5. React re-renders App.js e figli
         │
         ▼
6. Card.js riceve nuova prop card.quantita
   Cart.js riceve nuovo items array
         │
         ▼
7. UI aggiornata con nuova quantità
```

### Struttura Dati Principale

```typescript
// Tipo implicito (non TypeScript nel progetto, ma per documentazione)
interface Card {
  id: number;           // Identificatore unico (0-5)
  name: string;         // Nome visualizzato ("California", "Dragon", etc.)
  prezzo: number;       // Prezzo unitario in EUR (es. 2.50)
  img: string;          // Riferimento import immagine
  quantita: number;     // Quantità nel carrello (default: 0)
  categoria: string;    // 'roll' | 'nigiri' | 'special'
  description: string;  // Descrizione ingredienti
}

// State nel Context
cards: Card[]  // Array di 6 elementi
```

---

## 🪝 Custom Hooks

### useCart.js

**File:** `src/hooks/useCart.js`

Hook per gestione carrello con localStorage persistence.

```javascript
const {
  cards,
  cartItems,
  incrementItem,
  decrementItem,
  resetCart,
  totalQuantity,
  totalPrice,
  discountPercent,
  discountAmount,
  finalPrice,
  maxQuantity
} = useCart(initialProducts);
```

### usePWA.js

**File:** `src/hooks/usePWA.js`

Hook per funzionalità Progressive Web App.

```javascript
const {
  isOnline,           // boolean - stato connessione
  isInstallable,      // boolean - può essere installata
  isInstalled,        // boolean - già installata
  installApp,         // () => Promise - trigger install prompt
  dismissInstallPrompt // () => void - chiudi prompt
} = usePWA();
```

---

## 📱 PWA & Service Worker

### Configurazione PWA

**Files coinvolti:**
- `public/manifest.json` - Metadata app
- `public/sw.js` - Service Worker
- `src/hooks/usePWA.js` - Hook gestione
- `src/components/PWAPrompt.js` - UI prompt

### Service Worker Strategy

```javascript
// Cache-first per asset statici
if (request.destination === 'image' || 
    request.destination === 'script' || 
    request.destination === 'style') {
  // Prova cache, poi network
}

// Network-first per navigazione
if (request.mode === 'navigate') {
  // Prova network, fallback a /index.html
}
```

### Manifest

```json
{
  "short_name": "Sushi Project",
  "name": "Sushi Project - Ordina Sushi Online",
  "display": "standalone",
  "theme_color": "#1a1a2e",
  "background_color": "#1a1a2e"
}
```

---

## 📏 Convenzioni di Codice

### Naming Conventions Rilevate

| Elemento | Convenzione | Esempio |
|----------|-------------|---------|
| Componenti | PascalCase | `Card`, `Navbar`, `Footer` |
| File componenti | PascalCase.js | `Card.js`, `Cart.js` |
| Funzioni handler | camelCase con prefisso `handle` | `handleIncrement`, `handleDecrement` |
| Props callback | camelCase con prefisso `on` | `onIncrement`, `onDecrement` |
| State variables | camelCase | `cards`, `show` |
| CSS classes | snake_case o camelCase | `bg_cstm`, `size_sm` |

### Struttura Componenti

**Pattern Function Component:**
```javascript
import React from 'react';

// Commento descrittivo (presente in alcuni file)
const ComponentName = (props) => {
    return (
        <div>
            {/* JSX */}
        </div>
    );
}

export default ComponentName;
```

**Pattern Function Declaration (alternativo usato):**
```javascript
function ComponentName(props) {
    return (
        <>
            {/* JSX con Fragment */}
        </>
    );
}

export default ComponentName;
```

### Import Order (osservato)

```javascript
// 1. React e hooks
import React, { useState } from 'react';

// 2. Librerie esterne
import Button from 'react-bootstrap/Button';

// 3. CSS
import './App.css';

// 4. Componenti locali
import Navbar from './components/Navbar';

// 5. Assets (immagini)
import california from './images/california.png';
```

### Stile CSS

- **Framework:** Bootstrap 5 per layout e componenti base
- **Custom CSS:** Classi utility in `App.css`
- **Inline Styles:** Usati sporadicamente per override specifici

```javascript
// Esempio inline style (Card.js)
style={{width: '18rem', backgroundColor:'rgba(255, 255, 255, 0.666)'}}
```

---

## 🧩 Componenti: Specifiche Tecniche

### App.js (Aggiornato Sprint 3)

| Proprietà | Valore |
|-----------|--------|
| **Tipo** | Root Component con Providers |
| **State** | `isLoading` (solo per spinner iniziale) |
| **Hooks** | `useState`, `useEffect` |
| **Providers** | ThemeProvider, CartProvider, BrowserRouter |

**Struttura:**
```javascript
<ThemeProvider>
  <CartProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>
      </Routes>
    </Router>
  </CartProvider>
</ThemeProvider>
```

---

### Layout.js (Nuovo Sprint 3)

| Proprietà | Valore |
|-----------|--------|
| **Tipo** | Wrapper Component |
| **Context** | useCartContext, useTheme |
| **Children** | Navbar, Outlet, Footer, Toast, PWAPrompt |

**Responsabilità:** Struttura comune a tutte le pagine.

---

### HomePage.js (Nuovo Sprint 3)

| Proprietà | Valore |
|-----------|--------|
| **Tipo** | Page Component |
| **Context** | useCartContext |
| **State** | `activeFilter` per categoria |

**Funzionalità:**
- Griglia prodotti con Card
- Filtri per categoria (all, roll, nigiri, special)
- Link al carrello

---

### CartPage.js (Nuovo Sprint 3)

| Proprietà | Valore |
|-----------|--------|
| **Tipo** | Page Component |
| **Context** | useCartContext |
| **Navigation** | useNavigate per checkout |

**Funzionalità:**
- Lista prodotti nel carrello con quantità
- Modifica quantità inline
- Totali e sconti
- Bottone checkout

---

### CheckoutPage.js (Nuovo Sprint 3)

| Proprietà | Valore |
|-----------|--------|
| **Tipo** | Page Component |
| **Context** | useCartContext |
| **State** | `formData`, `errors`, `isSubmitting`, `orderComplete` |

**Funzionalità:**
- Form dati consegna con validazione
- Riepilogo ordine
- Conferma ordine con numero generato
- Redirect se carrello vuoto

---

### Card.js

| Proprietà | Valore |
|-----------|--------|
| **Tipo** | Presentational Component |
| **Props** | `card`, `onIncrement`, `onDecrement`, `maxQuantity` |
| **State** | Nessuno |

**Props Interface:**
```javascript
props.card = {
  id: number,
  name: string,
  prezzo: number,
  img: string,
  quantita: number,
  categoria: string,
  description: string
}
```

---

### Navbar.js (Aggiornato Sprint 3)

| Proprietà | Valore |
|-----------|--------|
| **Tipo** | Consumer Component |
| **Context** | useTheme, useCartContext |
| **Props** | `logoSrc`, `title` |

**Elementi:**
- Logo con Link a home
- Badge carrello con quantità totale
- Toggle Dark Mode
- Button Contact

---

### Cart.js (Modale legacy)

| Proprietà | Valore |
|-----------|--------|
| **Tipo** | Stateful Component (modale) |
| **Props** | `items`, `onReset` |
| **State** | `show`, `showConfirm`, `orderSent` |

**Nota:** Componente legacy, la funzionalità carrello principale è ora in CartPage.

---

### PWAPrompt.js (Nuovo Sprint 3)

| Proprietà | Valore |
|-----------|--------|
| **Tipo** | Consumer Component |
| **Hook** | usePWA |

**Funzionalità:**
- Indicatore stato offline
- Prompt installazione app

---

## 📦 Dipendenze & Configurazioni

### package.json - Dipendenze

```json
{
  "dependencies": {
    "react": "^18.2.0",              // Core React
    "react-dom": "^18.2.0",          // React DOM renderer
    "react-router-dom": "^6.x",      // Routing SPA (Sprint 3)
    "react-bootstrap": "^2.7.3",     // Componenti Bootstrap per React
    "bootstrap": "^5.2.3",           // CSS Framework
    "bootstrap-icons": "^1.10.4",    // Icone Bootstrap
    "prop-types": "^15.x",           // Validazione props
    "react-scripts": "5.0.1",        // Create React App toolchain
    "web-vitals": "^2.1.4"           // Performance metrics
  }
}
```

### Scripts Disponibili

| Comando | Descrizione |
|---------|-------------|
| `npm start` | Avvia dev server su localhost:3000 |
| `npm run build` | Build produzione in `/build` |
| `npm test` | Esegue test con Jest |
| `npm run eject` | Espone configurazione CRA (irreversibile) |

### Import Bootstrap (index.js)

```javascript
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";
```

---

## 🔧 Guida alle Modifiche

### Aggiungere un Nuovo Prodotto

1. **Aggiungi immagine** in `src/images/nuovo_roll.png`

2. **Modifica App.js:**
```javascript
// Aggiungi import
import nuovoRoll from './images/nuovo_roll.png';

// Aggiungi all'array cards in useState
{id:6, name: 'Nuovo Roll', prezzo:3.50, img: nuovoRoll, quantita:0}
```

### Modificare Prezzi

**File:** `src/App.js` - Array `cards` in `useState`

```javascript
{id:0 , name: 'California', prezzo:2.50, ...}  // ← Modifica qui
```

### Aggiungere Nuovo Componente

1. **Crea file** in `src/components/NuovoComponente.js`

2. **Struttura base:**
```javascript
import React from 'react';

const NuovoComponente = (props) => {
    return (
        <div>
            {/* Contenuto */}
        </div>
    );
}

export default NuovoComponente;
```

3. **Importa in App.js:**
```javascript
import NuovoComponente from './components/NuovoComponente';
```

### Implementare Sistema Sconto

**File:** `src/components/Cart.js`

```javascript
// Aggiungi dopo calcolo totalQuantity
const calculateDiscount = (quantity) => {
  const tiers = Math.floor(quantity / 10);
  return Math.min(tiers * 5, 50) / 100;
};

const discount = calculateDiscount(totalQuantity);
const discountedPrice = totalPrice * (1 - discount);
```

### Aggiungere Persistenza localStorage

**File:** `src/App.js`

```javascript
import React, { useState, useEffect } from 'react';

// Stato iniziale
const initialCards = [...];

// In App component
const [cards, setCard] = useState(() => {
  const saved = localStorage.getItem('sushiCart');
  return saved ? JSON.parse(saved) : initialCards;
});

// Aggiungi useEffect
useEffect(() => {
  localStorage.setItem('sushiCart', JSON.stringify(cards));
}, [cards]);
```

### Rendere Form Footer Funzionale

**Opzione 1 - EmailJS:**
```bash
npm install @emailjs/browser
```

**File:** `src/components/Footer.js`
```javascript
import emailjs from '@emailjs/browser';

const handleSubmit = (e) => {
  e.preventDefault();
  emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', e.target, 'PUBLIC_KEY')
    .then(() => alert('Inviato!'))
    .catch((err) => console.error(err));
};

// Nel form
<form onSubmit={handleSubmit}>
```

---

## ⚠️ Aree di Attenzione

### Note per Sviluppatori

1. **Context vs Props:** Usare `useCartContext()` e `useTheme()` invece di prop drilling
2. **Routing:** Tutte le route sono nested dentro Layout per condividere Navbar/Footer
3. **localStorage:** Gestito automaticamente da CartContext e ThemeContext
4. **PWA:** Il service worker è in `public/sw.js`, registrato da `usePWA` hook

### Considerazioni Performance

- Lazy loading immagini con `loading="lazy"`
- Service Worker cache-first per asset statici
- Context ottimizzato con `useCallback` per evitare re-render inutili

### Mancanze Note (Aggiornato Sprint 3) (Aggiornato Sprint 3)

| Feature | Status | File da modificare |
|---------|--------|-------------------|
| Persistenza carrello | ✅ Implementato | CartContext.js |
| Sistema sconto | ✅ Implementato | CartContext.js |
| Form checkout | ✅ Implementato | CheckoutPage.js |
| Dark mode | ✅ Implementato | ThemeContext.js |
| React Router | ✅ Implementato | App.js |
| PWA | ✅ Implementato | sw.js, usePWA.js |
| PropTypes | ✅ Implementati | Tutti i componenti |
| Backend API | ❌ Da fare | Sprint 4 |
| Autenticazione | ❌ Da fare | Sprint 4 |

---

## 📞 Riferimenti

- [React Docs](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Bootstrap 5](https://getbootstrap.com/docs/5.2/)
- [Create React App](https://create-react-app.dev/)
- [PWA](https://web.dev/progressive-web-apps/)

---

*Documento aggiornato: Gennaio 2026*  
*Versione: 3.0.0 - Sprint 3 Completato*
