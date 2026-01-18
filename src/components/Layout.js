import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import PWAPrompt from '../components/PWAPrompt';
import { useCartContext } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const { toast } = useCartContext();
  const { darkMode } = useTheme();

  return (
    <div className={`app-wrapper ${darkMode ? 'dark-mode' : ''}`}>
      <div className='bg_cstm'>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
        <Toast show={toast.show} message={toast.message} type={toast.type} />
        <PWAPrompt />
      </div>
    </div>
  );
};

export default Layout;
