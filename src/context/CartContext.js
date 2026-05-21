import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSushiPoints } from '../hooks/useSushiPoints';
import { useProducts } from '../hooks/useProducts';

const MAX_QUANTITY = 99;
const STORAGE_KEY  = 'sushiCart_v2';
const FAVORITES_KEY = 'sushiFavorites';

const CartContext = createContext(null);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCartContext deve essere usato dentro CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const { products, isLoading, isError } = useProducts();

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); }
    catch { return []; }
  });

  // quantities: { [productId]: number } — sostituisce l'array cards con quantita
  const [quantities, setQuantities] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) return saved;
    } catch { /* ignore */ }
    return {};
  });

  const [coupon, setCoupon] = useState(null);

  const { points: sushiPoints, totalOrders, addPoints, level: sushiLevel } = useSushiPoints();

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities));
  }, [quantities]);

  React.useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // cards = products arricchiti con la quantità — interfaccia identica a prima
  const cards = products.map(p => ({ ...p, quantita: quantities[p.id] || 0 }));
  const cartItems = cards.filter(c => c.quantita > 0);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 2500);
  }, []);

  const incrementItem = useCallback((card) => {
    setQuantities(prev => {
      const current = prev[card.id] || 0;
      if (current >= MAX_QUANTITY) { showToast(`Massimo ${MAX_QUANTITY} pezzi!`, 'warning'); return prev; }
      showToast(`${card.name} Roll aggiunto!`, 'success');
      return { ...prev, [card.id]: current + 1 };
    });
  }, [showToast]);

  const decrementItem = useCallback((card) => {
    setQuantities(prev => {
      const current = prev[card.id] || 0;
      if (current <= 0) return prev;
      showToast(`${card.name} Roll rimosso`, 'info');
      return { ...prev, [card.id]: current - 1 };
    });
  }, [showToast]);

  const resetCart = useCallback(() => {
    setQuantities({});
    setCoupon(null);
    showToast('Carrello svuotato', 'info');
  }, [showToast]);

  const toggleFavorite = useCallback((productId) => {
    setFavorites(prev => {
      if (prev.includes(productId)) { showToast('Rimosso dai preferiti', 'info'); return prev.filter(id => id !== productId); }
      showToast('Aggiunto ai preferiti ❤️', 'success');
      return [...prev, productId];
    });
  }, [showToast]);

  const isFavorite = useCallback((productId) => favorites.includes(productId), [favorites]);

  const applyCoupon = useCallback((code, discountPercent) => {
    setCoupon({ code, discountPercent });
    showToast(`Coupon ${code} applicato! -${discountPercent}%`, 'success');
  }, [showToast]);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    showToast('Coupon rimosso', 'info');
  }, [showToast]);

  const totals = cards.reduce((acc, item) => {
    acc.totalQuantity += item.quantita;
    acc.totalPrice    += item.prezzo * item.quantita;
    return acc;
  }, { totalQuantity: 0, totalPrice: 0 });
  totals.totalPrice = Math.round(totals.totalPrice * 100) / 100;

  const discountPercent  = Math.min(Math.floor(totals.totalQuantity / 10) * 5, 50);
  const discountAmount   = Math.round(totals.totalPrice * (discountPercent / 100) * 100) / 100;
  const afterQtyDiscount = Math.round((totals.totalPrice - discountAmount) * 100) / 100;

  const couponDiscountAmount = coupon
    ? Math.round(afterQtyDiscount * (coupon.discountPercent / 100) * 100) / 100
    : 0;
  const finalPrice = Math.round((afterQtyDiscount - couponDiscountAmount) * 100) / 100;

  const value = {
    cards, cartItems, products,
    isLoading, isError,
    incrementItem, decrementItem, resetCart,
    favorites, toggleFavorite, isFavorite,
    totalQuantity: totals.totalQuantity,
    totalPrice: totals.totalPrice,
    discountPercent, discountAmount,
    coupon, applyCoupon, removeCoupon,
    couponDiscountAmount, finalPrice,
    maxQuantity: MAX_QUANTITY,
    toast, showToast,
    sushiPoints, totalOrders, addPoints, sushiLevel,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = { children: PropTypes.node.isRequired };
export default CartContext;
