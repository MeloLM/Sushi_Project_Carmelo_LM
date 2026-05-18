import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSushiPoints } from '../hooks/useSushiPoints';

// Import immagini
import california from '../images/california.png';
import dragon from '../images/dragon.png';
import dynamite from '../images/dynamite.png';
import whitey from '../images/philadelphia.png';
import rainbow from '../images/rainbow.png';
import fungi from '../images/shrimp.png';

const MAX_QUANTITY = 99;
const STORAGE_KEY = 'sushiCart';
const FAVORITES_KEY = 'sushiFavorites';

const initialProducts = [
  { id: 0, name: 'California', prezzo: 2.50, img: california, quantita: 0, categoria: 'roll', description: 'Granchio, avocado, cetriolo, tobiko', allergeni: ['crostacei', 'pesce'] },
  { id: 1, name: 'Dragon', prezzo: 4.20, img: dragon, quantita: 0, categoria: 'special', description: 'Anguilla, avocado, salsa teriyaki', allergeni: ['pesce', 'soia', 'glutine'] },
  { id: 2, name: 'Dynamite', prezzo: 2.10, img: dynamite, quantita: 0, categoria: 'roll', description: 'Gambero in tempura, maionese piccante', allergeni: ['crostacei', 'uova', 'glutine'] },
  { id: 3, name: 'Whitey', prezzo: 1.50, img: whitey, quantita: 0, categoria: 'roll', description: 'Salmone, philadelphia, erba cipollina', allergeni: ['pesce', 'latticini'] },
  { id: 4, name: 'Rainbow', prezzo: 3.40, img: rainbow, quantita: 0, categoria: 'special', description: 'Mix di pesce fresco, avocado', allergeni: ['pesce', 'crostacei'] },
  { id: 5, name: 'Fungi', prezzo: 2.80, img: fungi, quantita: 0, categoria: 'nigiri', description: 'Gambero, riso, salsa speciale', allergeni: ['crostacei', 'soia'] },
];

const CartContext = createContext(null);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCartContext deve essere usato dentro CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); }
    catch { return []; }
  });
  const [cards, setCards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item, idx) => ({ ...initialProducts[idx], quantita: item.quantita || 0 }));
      }
    } catch { /* ignore */ }
    return initialProducts;
  });

  // Coupon state
  const [coupon, setCoupon] = useState(null); // { code, discountPercent }

  // Sushi Points (condivisi via context)
  const { points: sushiPoints, totalOrders, addPoints, level: sushiLevel } = useSushiPoints();

  React.useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(cards)); }, [cards]);
  React.useEffect(() => { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); }, [favorites]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 2500);
  }, []);

  const toggleFavorite = useCallback((productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) { showToast('Rimosso dai preferiti', 'info'); return prev.filter(id => id !== productId); }
      showToast('Aggiunto ai preferiti ❤️', 'success');
      return [...prev, productId];
    });
  }, [showToast]);

  const isFavorite = useCallback((productId) => favorites.includes(productId), [favorites]);

  const incrementItem = useCallback((card) => {
    if (card.quantita >= MAX_QUANTITY) { showToast(`Massimo ${MAX_QUANTITY} pezzi!`, 'warning'); return; }
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, quantita: c.quantita + 1 } : c));
    showToast(`${card.name} Roll aggiunto!`, 'success');
  }, [showToast]);

  const decrementItem = useCallback((card) => {
    setCards(prev => prev.map(c => {
      if (c.id === card.id && c.quantita > 0) { showToast(`${card.name} Roll rimosso`, 'info'); return { ...c, quantita: c.quantita - 1 }; }
      return c;
    }));
  }, [showToast]);

  const resetCart = useCallback(() => {
    setCards(initialProducts.map(p => ({ ...p, quantita: 0 })));
    setCoupon(null);
    showToast('Carrello svuotato', 'info');
  }, [showToast]);

  // Coupon actions
  const applyCoupon = useCallback((code, discountPercent) => {
    setCoupon({ code, discountPercent });
    showToast(`Coupon ${code} applicato! -${discountPercent}%`, 'success');
  }, [showToast]);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    showToast('Coupon rimosso', 'info');
  }, [showToast]);

  // Calcola totali
  const totals = cards.reduce((acc, item) => {
    acc.totalQuantity += item.quantita;
    acc.totalPrice += item.prezzo * item.quantita;
    return acc;
  }, { totalQuantity: 0, totalPrice: 0 });
  totals.totalPrice = Math.round(totals.totalPrice * 100) / 100;

  const discountPercent = Math.min(Math.floor(totals.totalQuantity / 10) * 5, 50);
  const discountAmount = Math.round(totals.totalPrice * (discountPercent / 100) * 100) / 100;
  const priceAfterQuantityDiscount = Math.round((totals.totalPrice - discountAmount) * 100) / 100;

  // Applica coupon sopra lo sconto quantità
  const couponDiscountAmount = coupon
    ? Math.round(priceAfterQuantityDiscount * (coupon.discountPercent / 100) * 100) / 100
    : 0;
  const finalPrice = Math.round((priceAfterQuantityDiscount - couponDiscountAmount) * 100) / 100;

  const cartItems = cards.filter(item => item.quantita > 0);

  const value = {
    cards, cartItems, initialProducts,
    incrementItem, decrementItem, resetCart,
    favorites, toggleFavorite, isFavorite,
    totalQuantity: totals.totalQuantity,
    totalPrice: totals.totalPrice,
    discountPercent, discountAmount,
    coupon, applyCoupon, removeCoupon,
    couponDiscountAmount,
    finalPrice,
    maxQuantity: MAX_QUANTITY,
    toast, showToast,
    sushiPoints, totalOrders, addPoints, sushiLevel,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = { children: PropTypes.node.isRequired };
export default CartContext;
