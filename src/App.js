import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Context Providers
import { CartProvider, ThemeProvider } from './context';

// Layout e Pagine
import { Layout, ScrollToTop } from './components';
import { HomePage, CartPage, CheckoutPage, NotFoundPage } from './pages';

/**
 * TODO #15: Hook per titoli pagina dinamici
 */
const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      '/': 'Sushi Project - Menu',
      '/cart': 'Carrello - Sushi Project',
      '/checkout': 'Checkout - Sushi Project'
    };

    document.title = titles[location.pathname] || 'Sushi Project';
  }, [location]);
};

/**
 * AppContent - Contenuto principale con hook location-dipendenti
 */
const AppContent = () => {
  useDocumentTitle();

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          {/* TODO #1: Pagina 404 per route inesistenti */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      {/* TODO #3: Bottone scroll to top */}
      <ScrollToTop />
    </>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simula caricamento iniziale
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Caricamento menu...</p>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;
