# 🍣 Sushi Project

> Applicazione web React per la visualizzazione e selezione di sushi roll con carrello integrato.

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.2.3-7952B3?logo=bootstrap)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-Educational-green)]()

---

## 📋 Descrizione

**Sushi Project** è una Single Page Application (SPA) che simula un menu digitale per un ristorante di sushi. Gli utenti possono sfogliare il catalogo prodotti, aggiungere/rimuovere elementi dal carrello e visualizzare il totale dell'ordine in tempo reale.

### Obiettivo di Business
Fornire un'interfaccia utente intuitiva per la consultazione del menu e la composizione di ordini sushi, con calcolo automatico dei totali.

---

## 🛠️ Tech Stack

| Tecnologia | Versione | Scopo |
|------------|----------|-------|
| **React** | 18.2.0 | Framework UI / State Management |
| **React Bootstrap** | 2.7.3 | Componenti UI pre-costruiti |
| **Bootstrap** | 5.2.3 | Sistema di grid e styling |
| **Bootstrap Icons** | 1.10.4 | Icone vettoriali |
| **Create React App** | 5.0.1 | Toolchain di build |

---

## ⚙️ Prerequisiti

Prima di iniziare, assicurati di avere installato:

- **Node.js** >= 14.x ([Download](https://nodejs.org/))
- **npm** >= 6.x (incluso con Node.js)

Verifica l'installazione:
```bash
node -v
npm -v
```

---

## 🚀 Installazione & Avvio

### 1. Clona il repository
```bash
git clone https://github.com/MeloLM/Sushi_Project_Carmelo_LM.git
cd Sushi_Project_Carmelo_LM-main
```

### 2. Installa le dipendenze
```bash
npm install
```

### 3. Avvia il server di sviluppo
```bash
npm start
```

### 4. Apri nel browser
```
http://localhost:3000
```

### Build per Produzione
```bash
npm run build
```
L'output ottimizzato sarà nella cartella `/build`.

### Esegui i Test
```bash
npm test
```

---

## ✨ Feature Principali

### Implementate ✅
- **Catalogo Prodotti**: Visualizzazione di 6 tipi di sushi roll con immagine, nome e prezzo
- **Gestione Quantità**: Pulsanti +/- per incrementare o decrementare la quantità per prodotto
- **Carrello Modale**: Riepilogo ordine con lista prodotti selezionati
- **Calcolo Totali**: Calcolo automatico del totale pezzi e prezzo complessivo
- **UI Responsive**: Layout adattivo con Bootstrap grid system
- **Background Immersivo**: Sfondo fotografico a tema sushi

### Prodotti Disponibili
| Roll | Prezzo |
|------|--------|
| California | €2.50 |
| Dragon | €4.20 |
| Dynamite | €2.10 |
| Whitey | €1.50 |
| Rainbow | €3.40 |
| Fungi | €2.80 |

### Placeholder (Non Funzionali) ⚠️
- Form feedback nel footer (UI presente, invio non implementato)
- Bottone "Contact" nella navbar (solo UI)
- Sistema sconto progressivo (codice commentato nel sorgente)

---

## 📁 Struttura Progetto

```
Sushi_Project_Carmelo_LM-main/
├── public/
│   ├── index.html          # Template HTML
│   ├── manifest.json       # Config PWA
│   └── robots.txt          # SEO config
├── src/
│   ├── App.js              # Componente root + state management
│   ├── App.css             # Stili globali
│   ├── index.js            # Entry point React
│   ├── index.css           # Stili base
│   ├── components/
│   │   ├── Card.js         # Card singolo prodotto
│   │   ├── Cart.js         # Modale carrello
│   │   ├── Navbar.js       # Barra navigazione
│   │   └── Footer.js       # Footer con form
│   └── images/             # Assets grafici
├── package.json
├── README.md
└── ARCHITECTURE.md         # 📖 Documentazione tecnica dettagliata
```

> 📖 **Per sviluppatori:** Consulta [ARCHITECTURE.md](./ARCHITECTURE.md) per dettagli su pattern, flusso dati e guida alle modifiche.

---

## 🔮 Roadmap (Sviluppi Futuri)

- [ ] Persistenza carrello con localStorage
- [ ] Sistema sconto progressivo (5% ogni 10 pezzi, max 50%)
- [ ] Form feedback funzionale (integrazione EmailJS)
- [ ] Routing multi-pagina con React Router
- [ ] Autenticazione utenti
- [ ] Backend con database

---

## 👤 Autore

**Carmelo La Mantia**  
- 📧 Email: carmelo.la.mantia00@gmail.com  
- 🐙 GitHub: [@MeloLM](https://github.com/MeloLM)

---

## 📄 Licenza

Progetto a scopo educativo/portfolio.  
Per utilizzo commerciale, contattare l'autore.

---

*Ultimo aggiornamento: Gennaio 2026*
