import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Context Providers
import { CartProvider, ThemeProvider, AuthProvider } from './context';

// Layout e Pagine
import { Layout, ScrollToTop, ProtectedRoute } from './components';
import { HomePage, CartPage, CheckoutPage, LoginPage, RegisterPage, NotFoundPage, BoxBuilderPage } from './pages';

const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      '/': 'ZenSushi - Menu',
      '/cart': 'Carrello - ZenSushi',
      '/box-builder': 'Box Builder - ZenSushi',
      '/checkout': 'Checkout - ZenSushi',
      '/login': 'Accedi - ZenSushi',
      '/register': 'Registrati - ZenSushi',
    };

    document.title = titles[location.pathname] || 'ZenSushi';
  }, [location]);
};

const AppContent = () => {
  useDocumentTitle();

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="box-builder" element={<BoxBuilderPage />} />
          <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <ScrollToTop />
    </>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

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
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
