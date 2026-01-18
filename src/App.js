import React, {useState, useEffect} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Card from './components/Card';
import Cart from './components/Cart';
import Footer from './components/Footer';
import Toast from './components/Toast';

import california from './images/california.png';
import dragon from './images/dragon.png';
import dynamite from './images/dynamite.png';
import whitey from './images/philadelphia.png';
import rainbow from './images/rainbow.png';
import fungi from './images/shrimp.png';

// Costanti
const MAX_QUANTITY = 99;

// Dati prodotti iniziali con categorie e descrizioni
const initialProducts = [
  {id:0, name: 'California', prezzo:2.50, img: california, quantita:0, categoria: 'roll', description: 'Granchio, avocado, cetriolo, tobiko'},
  {id:1, name: 'Dragon', prezzo:4.20, img: dragon, quantita:0, categoria: 'special', description: 'Anguilla, avocado, salsa teriyaki'},
  {id:2, name: 'Dynamite', prezzo:2.10, img: dynamite, quantita:0, categoria: 'roll', description: 'Gambero in tempura, maionese piccante'},
  {id:3, name: 'Whitey', prezzo:1.50, img: whitey, quantita:0, categoria: 'roll', description: 'Salmone, philadelphia, erba cipollina'},
  {id:4, name: 'Rainbow', prezzo:3.40, img: rainbow, quantita:0, categoria: 'special', description: 'Mix di pesce fresco, avocado'},
  {id:5, name: 'Fungi', prezzo:2.80, img: fungi, quantita:0, categoria: 'nigiri', description: 'Gambero, riso, salsa speciale'},
];

// Mappa immagini per ripristino da localStorage
const imageMap = { california, dragon, dynamite, whitey, rainbow, fungi };

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Carica carrello da localStorage o usa valori iniziali
  const [cards, setCard] = useState(() => {
    const saved = localStorage.getItem('sushiCart');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ripristina riferimenti immagini e nuovi campi
      return parsed.map((item, idx) => ({
        ...initialProducts[idx],
        quantita: item.quantita || 0
      }));
    }
    return initialProducts;
  });

  // Simula caricamento iniziale
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Salva carrello in localStorage ad ogni modifica
  useEffect(() => {
    localStorage.setItem('sushiCart', JSON.stringify(cards));
  }, [cards]);

  // Mostra toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 2500);
  };

  const handleIncrement = card => {
    if (card.quantita >= MAX_QUANTITY) {
      showToast(`Massimo ${MAX_QUANTITY} pezzi per prodotto!`, 'warning');
      return;
    }
    const newCards = [...cards];
    const id = newCards.indexOf(card);
    newCards[id] = {...card};
    newCards[id].quantita++;
    setCard(newCards);
    showToast(`${card.name} Roll aggiunto!`, 'success');
  }

  const handleDecrement = card => {
    const newCards = [...cards];
    const id = newCards.indexOf(card);
    newCards[id] = {...card};
    const oldQty = newCards[id].quantita;
    newCards[id].quantita = Math.max(0, newCards[id].quantita - 1);
    setCard(newCards);
    if (oldQty > 0) {
      showToast(`${card.name} Roll rimosso`, 'info');
    }
  }

  // Svuota il carrello
  const handleReset = () => {
    setCard(initialProducts.map(p => ({...p, quantita: 0})));
    showToast('Carrello svuotato', 'info');
  }

  // Filtra prodotti per categoria
  const filteredCards = activeFilter === 'all' 
    ? cards 
    : cards.filter(card => card.categoria === activeFilter);

  // Categorie disponibili
  const categories = [
    { key: 'all', label: 'Tutti' },
    { key: 'roll', label: 'Roll' },
    { key: 'nigiri', label: 'Nigiri' },
    { key: 'special', label: 'Special' }
  ];

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Caricamento menu...</p>
      </div>
    );
  }

  return (
   <>
   <div className='bg_cstm'>
      <Navbar />
      <div className="container min-vh-100">
        <div className="d-flex justify-content-center align-items-center flex-wrap">
          <h1 className='text-center text-white me-5'>Cosa desideri ordinare?</h1>
          <Cart items={cards} onReset={handleReset} />
        </div>

        {/* Filtri categoria */}
        <div className="filter-buttons text-center my-3">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`btn btn-filter mx-1 ${activeFilter === cat.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      
        <hr className='text-white'/>
        <div className="row justify-content-center">
          {filteredCards.map(card =>(
          <Card 
            key={card.id} 
            card={card} 
            onDecrement={handleDecrement} 
            onIncrement={handleIncrement}
            maxQuantity={MAX_QUANTITY}
          />
          ))}
        </div>
      </div>
      <Footer />
      
      {/* Toast Notification */}
      <Toast show={toast.show} message={toast.message} type={toast.type} />
   </div>

   </>
  );
}

export default App;
