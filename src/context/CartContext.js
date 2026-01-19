import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// Import immagini
import california from '../images/california.png';
import dragon from '../images/dragon.png';
import dynamite from '../images/dynamite.png';
import whitey from '../images/philadelphia.png';
import rainbow from '../images/rainbow.png';
import fungi from '../images/shrimp.png';

// Costanti
const MAX_QUANTITY = 99;
const STORAGE_KEY = 'sushiCart';
const FAVORITES_KEY = 'sushiFavorites'; // TODO #5: Chiave localStorage per favoriti

// TODO #10: Legenda allergeni
// 🦐 = crostacei, 🐟 = pesce, 🥛 = latticini, 🥚 = uova, 🌾 = glutine, 🥜 = soia

// Dati prodotti iniziali con allergeni (TODO #10)
const initialProducts = [
  { id: 0, name: 'California', prezzo: 2.50, img: california, quantita: 0, categoria: 'roll', description: 'Granchio, avocado, cetriolo, tobiko', allergeni: ['crostacei', 'pesce'] },
  { id: 1, name: 'Dragon', prezzo: 4.20, img: dragon, quantita: 0, categoria: 'special', description: 'Anguilla, avocado, salsa teriyaki', allergeni: ['pesce', 'soia', 'glutine'] },
  { id: 2, name: 'Dynamite', prezzo: 2.10, img: dynamite, quantita: 0, categoria: 'roll', description: 'Gambero in tempura, maionese piccante', allergeni: ['crostacei', 'uova', 'glutine'] },
  { id: 3, name: 'Whitey', prezzo: 1.50, img: whitey, quantita: 0, categoria: 'roll', description: 'Salmone, philadelphia, erba cipollina', allergeni: ['pesce', 'latticini'] },
  { id: 4, name: 'Rainbow', prezzo: 3.40, img: rainbow, quantita: 0, categoria: 'special', description: 'Mix di pesce fresco, avocado', allergeni: ['pesce', 'crostacei'] },
  { id: 5, name: 'Fungi', prezzo: 2.80, img: fungi, quantita: 0, categoria: 'nigiri', description: 'Gambero, riso, salsa speciale', allergeni: ['crostacei', 'soia'] },
];

// Crea Context
const CartContext = createContext(null);

// Hook per usare il context
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext deve essere usato dentro CartProvider');
  }
  return context;
};

// Provider Component
export const CartProvider = ({ children }) => {
  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // TODO #5: Favoriti state con persistenza localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Errore caricamento favoriti:', error);
      return [];
    }
  });

  // Carica carrello da localStorage
  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item, idx) => ({
          ...initialProducts[idx],
          quantita: item.quantita || 0
        }));
      }
    } catch (error) {
      console.error('Errore caricamento carrello:', error);
    }
    return initialProducts;
  });

  // Salva carrello in localStorage
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }, [cards]);

  // Salva dark mode in localStorage
  React.useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  // TODO #5: Salva favoriti in localStorage
  React.useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Mostra toast notification
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 2500);
  }, []);

  // TODO #5: Toggle favorito
  const toggleFavorite = useCallback((productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) {
        showToast('Rimosso dai preferiti', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Aggiunto ai preferiti ❤️', 'success');
        return [...prev, productId];
      }
    });
  }, [showToast]);

  // TODO #5: Check se prodotto è favorito
  const isFavorite = useCallback((productId) => {
    return favorites.includes(productId);
  }, [favorites]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  // Incrementa quantità
  const incrementItem = useCallback((card) => {
    if (card.quantita >= MAX_QUANTITY) {
      showToast(`Massimo ${MAX_QUANTITY} pezzi per prodotto!`, 'warning');
      return;
    }

    setCards(prevCards => {
      const newCards = [...prevCards];
      const idx = newCards.findIndex(c => c.id === card.id);
      if (idx !== -1) {
        newCards[idx] = { ...newCards[idx], quantita: newCards[idx].quantita + 1 };
      }
      return newCards;
    });

    showToast(`${card.name} Roll aggiunto!`, 'success');
  }, [showToast]);

  // Decrementa quantità
  const decrementItem = useCallback((card) => {
    setCards(prevCards => {
      const newCards = [...prevCards];
      const idx = newCards.findIndex(c => c.id === card.id);
      if (idx !== -1 && newCards[idx].quantita > 0) {
        newCards[idx] = { ...newCards[idx], quantita: newCards[idx].quantita - 1 };
        showToast(`${card.name} Roll rimosso`, 'info');
      }
      return newCards;
    });
  }, [showToast]);

  // Svuota carrello
  const resetCart = useCallback(() => {
    setCards(initialProducts.map(p => ({ ...p, quantita: 0 })));
    showToast('Carrello svuotato', 'info');
  }, [showToast]);

  // Calcola totali
  const totals = cards.reduce((acc, item) => {
    acc.totalQuantity += item.quantita;
    acc.totalPrice += item.prezzo * item.quantita;
    return acc;
  }, { totalQuantity: 0, totalPrice: 0 });

  totals.totalPrice = Math.round(totals.totalPrice * 100) / 100;

  // Sistema sconto
  const discountPercent = Math.min(Math.floor(totals.totalQuantity / 10) * 5, 50);
  const discountAmount = totals.totalPrice * (discountPercent / 100);
  const finalPrice = Math.round((totals.totalPrice - discountAmount) * 100) / 100;

  // Items nel carrello
  const cartItems = cards.filter(item => item.quantita > 0);

  const value = {
    // Prodotti
    cards,
    cartItems,
    initialProducts,

    // Azioni carrello
    incrementItem,
    decrementItem,
    resetCart,

    // TODO #5: Favoriti
    favorites,
    toggleFavorite,
    isFavorite,

    // Totali
    totalQuantity: totals.totalQuantity,
    totalPrice: totals.totalPrice,
    discountPercent,
    discountAmount,
    finalPrice,
    maxQuantity: MAX_QUANTITY,

    // Toast
    toast,
    showToast,

    // Dark mode
    darkMode,
    toggleDarkMode
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default CartContext;
