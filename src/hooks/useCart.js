import { useState, useEffect, useCallback } from 'react';

// Costanti
const MAX_QUANTITY = 99;
const STORAGE_KEY = 'sushiCart';

/**
 * Custom hook per la gestione del carrello
 * Gestisce stato, persistenza localStorage, e operazioni CRUD
 */
const useCart = (initialProducts, imageMap = {}) => {
  // Carica carrello da localStorage o usa valori iniziali
  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ripristina riferimenti immagini e nuovi campi
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

  // Salva carrello in localStorage ad ogni modifica
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (error) {
      console.error('Errore salvataggio carrello:', error);
    }
  }, [cards]);

  // Incrementa quantità prodotto
  const incrementItem = useCallback((card) => {
    if (card.quantita >= MAX_QUANTITY) {
      return { success: false, message: `Massimo ${MAX_QUANTITY} pezzi per prodotto!`, type: 'warning' };
    }
    
    setCards(prevCards => {
      const newCards = [...prevCards];
      const idx = newCards.findIndex(c => c.id === card.id);
      if (idx !== -1) {
        newCards[idx] = { ...newCards[idx], quantita: newCards[idx].quantita + 1 };
      }
      return newCards;
    });
    
    return { success: true, message: `${card.name} Roll aggiunto!`, type: 'success' };
  }, []);

  // Decrementa quantità prodotto
  const decrementItem = useCallback((card) => {
    let wasRemoved = false;
    
    setCards(prevCards => {
      const newCards = [...prevCards];
      const idx = newCards.findIndex(c => c.id === card.id);
      if (idx !== -1 && newCards[idx].quantita > 0) {
        newCards[idx] = { ...newCards[idx], quantita: newCards[idx].quantita - 1 };
        wasRemoved = true;
      }
      return newCards;
    });
    
    if (wasRemoved) {
      return { success: true, message: `${card.name} Roll rimosso`, type: 'info' };
    }
    return { success: false, message: '', type: '' };
  }, []);

  // Svuota il carrello
  const resetCart = useCallback(() => {
    setCards(initialProducts.map(p => ({ ...p, quantita: 0 })));
    return { success: true, message: 'Carrello svuotato', type: 'info' };
  }, [initialProducts]);

  // Calcola totali
  const totals = cards.reduce((acc, item) => {
    acc.totalQuantity += item.quantita;
    acc.totalPrice += item.prezzo * item.quantita;
    return acc;
  }, { totalQuantity: 0, totalPrice: 0 });

  // Arrotonda il prezzo
  totals.totalPrice = Math.round(totals.totalPrice * 100) / 100;

  // Sistema sconto: 5% ogni 10 pezzi, max 50%
  const discountPercent = Math.min(Math.floor(totals.totalQuantity / 10) * 5, 50);
  const discountAmount = totals.totalPrice * (discountPercent / 100);
  const finalPrice = Math.round((totals.totalPrice - discountAmount) * 100) / 100;

  // Ottieni solo items nel carrello
  const cartItems = cards.filter(item => item.quantita > 0);

  return {
    cards,
    cartItems,
    incrementItem,
    decrementItem,
    resetCart,
    totalQuantity: totals.totalQuantity,
    totalPrice: totals.totalPrice,
    discountPercent,
    discountAmount,
    finalPrice,
    maxQuantity: MAX_QUANTITY
  };
};

export default useCart;
