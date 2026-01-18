# 🏗️ ARCHITECTURE.md - Guida Tecnica per Sviluppatori

> Documento destinato a sviluppatori e AI agents che devono orientarsi nel progetto, modificare funzionalità esistenti o aggiungerne di nuove.

---

## 📑 Indice

1. [Mappa del File System](#mappa-del-file-system)
2. [Design Pattern Utilizzati](#design-pattern-utilizzati)
3. [Flusso Dati](#flusso-dati)
4. [Convenzioni di Codice](#convenzioni-di-codice)
5. [Componenti: Specifiche Tecniche](#componenti-specifiche-tecniche)
6. [Dipendenze & Configurazioni](#dipendenze--configurazioni)
7. [Guida alle Modifiche](#guida-alle-modifiche)

---

## 📁 Mappa del File System

```
Sushi_Project_Carmelo_LM-main/
│
├── 📄 package.json              # Dipendenze npm e script di build
├── 📄 README.md                 # Documentazione utente/overview
├── 📄 ARCHITECTURE.md           # Questo file - documentazione tecnica
│
├── 📂 public/                   # Asset statici serviti direttamente
│   ├── index.html              # Template HTML root (mount point React)
│   ├── manifest.json           # Configurazione PWA (metadata app)
│   └── robots.txt              # Direttive per crawler SEO
│
└── 📂 src/                      # Codice sorgente applicazione
    │
    ├── 📄 index.js              # ⭐ ENTRY POINT - Bootstrap React + import CSS
    ├── 📄 index.css             # Reset CSS e font-family base
    ├── 📄 App.js                # ⭐ ROOT COMPONENT - State management centrale
    ├── 📄 App.css               # Stili globali (background, classi utility)
    ├── 📄 App.test.js           # Test unitari (Create React App default)
    ├── 📄 setupTests.js         # Configurazione Jest
    ├── 📄 reportWebVitals.js    # Metriche performance (CRA default)
    │
    ├── 📂 components/           # Componenti React riutilizzabili
    │   ├── Card.js             # Card prodotto singolo (presentational)
    │   ├── Cart.js             # Modale carrello con totali (stateful)
    │   ├── Navbar.js           # Header con logo e navigazione
    │   └── Footer.js           # Footer con form feedback
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
| `src/App.js` | State management, layout principale | Aggiungere prodotti, modificare logica business |
| `src/components/` | UI components | Modificare aspetto visivo, aggiungere elementi UI |
| `src/images/` | Asset grafici | Aggiungere nuove immagini prodotto |
| `src/App.css` | Stili globali | Modificare tema, background, utility classes |
| `public/index.html` | Template HTML | Meta tags, favicon, titolo pagina |

---

## 🎨 Design Pattern Utilizzati

### 1. Container/Presentational Pattern

**Implementazione nel progetto:**

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTAINER COMPONENT                       │
│                         App.js                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  • Gestisce lo stato (useState)                      │    │
│  │  • Contiene la logica business                       │    │
│  │  • Passa dati e callback via props                   │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ PRESENTATIONAL│ │ PRESENTATIONAL│ │  STATEFUL   │
│   Card.js    │  │  Navbar.js   │  │  Cart.js    │
│              │  │              │  │             │
│ Solo render  │  │ Solo render  │  │ UI state    │
│ Props → UI   │  │ Props → UI   │  │ (show/hide) │
└─────────────┘   └─────────────┘   └─────────────┘
```

**File coinvolti:**
- **Container:** `App.js` - Gestisce `cards` state e funzioni `handleIncrement`/`handleDecrement`
- **Presentational:** `Card.js`, `Navbar.js`, `Footer.js` - Ricevono props, renderizzano UI
- **Ibrido:** `Cart.js` - Riceve props ma gestisce proprio stato locale (`show` per modale)

### 2. Lifting State Up

Lo stato condiviso (`cards` array) è "sollevato" al componente padre comune più vicino (`App.js`), permettendo a più componenti figli di accedervi.

```javascript
// App.js - Stato sollevato
const [cards, setCard] = useState([...]);

// Passaggio ai figli
<Card card={card} onIncrement={handleIncrement} />
<Cart items={cards} />
```

### 3. Callback Props Pattern

I componenti figli comunicano con il padre tramite callback passate come props:

```javascript
// App.js passa callback
<Card onIncrement={handleIncrement} onDecrement={handleDecrement} />

// Card.js invoca callback
<button onClick={() => props.onIncrement(props.card)}>+</button>
```

### 4. Immutable State Updates

Aggiornamenti stato seguono pattern immutabile (non mutano direttamente):

```javascript
// ✅ Pattern corretto usato
const handleIncrement = card => {
  const newCards = [...cards];           // Clona array
  const id = newCards.indexOf(card);
  newCards[id] = {...card};              // Clona oggetto
  newCards[id].quantita++;               // Modifica clone
  setCard(newCards);                     // Aggiorna stato
}
```

---

## 🔄 Flusso Dati

### Diagramma Flusso Completo

```
┌──────────────────────────────────────────────────────────────────┐
│                         APP.JS (State Owner)                      │
│                                                                    │
│  cards = [                                                        │
│    {id:0, name:'California', prezzo:2.50, img:california, quantita:0},
│    {id:1, name:'Dragon', prezzo:4.20, img:dragon, quantita:0},   │
│    ...                                                            │
│  ]                                                                │
│                                                                    │
│  handleIncrement(card) ──────┐                                    │
│  handleDecrement(card) ──────┼── Modificano state                 │
│                              │                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼ props: card,         ▼ props: items         ▼ (nessuna prop)
        │ onIncrement,         │                      │
        │ onDecrement          │                      │
        │                      │                      │
   ┌────┴────┐            ┌────┴────┐           ┌─────┴─────┐
   │ Card.js │ (x6)       │ Cart.js │           │ Navbar.js │
   │         │            │         │           │ Footer.js │
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
}

// State
cards: Card[]  // Array di 6 elementi
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

### App.js

| Proprietà | Valore |
|-----------|--------|
| **Tipo** | Container Component |
| **State** | `cards: Card[]` |
| **Hooks** | `useState` |
| **Children** | Navbar, Cart, Card (x6), Footer |

**Metodi:**
```javascript
handleIncrement(card)  // Incrementa card.quantita di 1
handleDecrement(card)  // Decrementa card.quantita di 1 (min 0)
```

**Note:** 
- `handleDelete` presente ma commentato (non usato)
- Prodotti hardcoded nell'array iniziale

---

### Card.js

| Proprietà | Valore |
|-----------|--------|
| **Tipo** | Presentational Component |
| **Props** | `card`, `onIncrement`, `onDecrement` |
| **State** | Nessuno |

**Props Interface:**
```javascript
props.card = {
  id: number,
  name: string,
  prezzo: number,
  img: string,
  quantita: number
}
props.onIncrement = (card) => void
props.onDecrement = (card) => void
```

---

### Cart.js

| Proprietà | Valore |
|-----------|--------|
| **Tipo** | Stateful Component |
| **Props** | `items` (array cards) |
| **State** | `show: boolean` |
| **Hooks** | `useState` |

**Logica Calcolo:**
```javascript
let totalQuantity = 0;
let totalPrice = 0;

props.items.forEach((item) => {
  totalQuantity += item.quantita;
  totalPrice += item.prezzo * item.quantita;
});

totalPrice = Math.round(totalPrice * 100) / 100; // Arrotondamento 2 decimali
```

**TODO commentato nel codice:**
```javascript
// Aggiungere 5% di sconto ogni 10 pezzi fino max 50% su tot
```

---

### Navbar.js

| Proprietà | Valore |
|-----------|--------|
| **Tipo** | Presentational Component |
| **Props** | Nessuna |
| **State** | Nessuno |

**Elementi:**
- Logo: `sushi.png` (20px width via `.size_sm`)
- Testo: "Sushi Project"
- Button: "Contact" (non funzionale)

---

### Footer.js

| Proprietà | Valore |
|-----------|--------|
| **Tipo** | Presentational Component |
| **Props** | Nessuna |
| **State** | Nessuno |

**Elementi:**
- Form email (submit non gestito)
- Link autore GitHub

---

## 📦 Dipendenze & Configurazioni

### package.json - Dipendenze

```json
{
  "dependencies": {
    "react": "^18.2.0",              // Core React
    "react-dom": "^18.2.0",          // React DOM renderer
    "react-bootstrap": "^2.7.3",     // Componenti Bootstrap per React
    "bootstrap": "^5.2.3",           // CSS Framework
    "bootstrap-icons": "^1.10.4",    // Icone Bootstrap
    "react-scripts": "5.0.1",        // Create React App toolchain
    "web-vitals": "^2.1.4",          // Performance metrics
    "@testing-library/*": "..."      // Testing utilities
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

### Bug Potenziali

1. **Cart.js riga 39:** `key` su `<li>` invece che sull'elemento con `.map()`
```javascript
// Attuale (warning React)
<li>
  <div key={item.id}>

// Corretto
<li key={item.id}>
  <div>
```

2. **handleDecrement:** Logica corretto ma potrebbe essere semplificata
```javascript
// Attuale
if (newCards[id].quantita >= 0) {  
  setCard(newCards);
} else {
  newCards[id].quantita = 0;
}

// Più pulito
newCards[id].quantita = Math.max(0, newCards[id].quantita - 1);
setCard(newCards);
```

### Mancanze Note

| Feature | Status | File da modificare |
|---------|--------|-------------------|
| Persistenza carrello | ❌ Mancante | App.js |
| Sistema sconto | ❌ Commentato | Cart.js |
| Form feedback | ❌ Non funzionale | Footer.js |
| Contact button | ❌ Non funzionale | Navbar.js |
| Validazione input | ❌ Mancante | Footer.js |
| PropTypes | ❌ Non implementati | Tutti i componenti |

---

## 📞 Riferimenti

- [React Docs](https://reactjs.org/docs/getting-started.html)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Bootstrap 5](https://getbootstrap.com/docs/5.2/)
- [Create React App](https://create-react-app.dev/)

---

*Documento generato: Gennaio 2026*  
*Versione: 1.0.0*
