import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Toast from './Toast';
import PWAPrompt from './PWAPrompt';
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
