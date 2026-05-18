import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../images/sushi.png';
import { useTheme } from '../context/ThemeContext';
import { useCartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar({ logoSrc = null, title = 'ZenSushi' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const { totalQuantity, sushiPoints, sushiLevel } = useCartContext();
  const { user, signOut } = useAuth();

  const scrollToFooter = () => document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-dark bg-transparent" role="navigation" aria-label="Main navigation">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand mb-0 h1 text-decoration-none">
          <img src={logoSrc || logo} className="size_sm me-2" alt={`Logo ${title}`} />
          <span className="d-inline">{title}</span>
        </Link>

        <div className="d-flex align-items-center gap-2">
          {/* Sushi Points */}
          {sushiPoints > 0 && (
            <div className="sushi-points-badge" title={`Livello: ${sushiLevel.name}`}>
              <span>{sushiLevel.emoji}</span>
              <span className="points-value">{sushiPoints} pt</span>
            </div>
          )}

          {/* Auth Section */}
          {user ? (
            <>
              <span className="text-white small d-none d-md-inline" title={user.email}>
                <i className="bi bi-person-circle me-1"></i>
                {user.email.split('@')[0]}
              </span>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleSignOut}
                aria-label="Esci dall'account"
                title="Esci"
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn btn-outline-light btn-sm"
              aria-label="Accedi"
            >
              <i className="bi bi-person me-1"></i>
              <span className="d-none d-md-inline">Accedi</span>
            </Link>
          )}

          <button
            className="btn btn-outline-light"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Passa a tema chiaro' : 'Passa a tema scuro'}
          >
            <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
          </button>

          <Link
            to="/cart"
            className={`btn ${location.pathname === '/cart' ? 'btn-light' : 'btn-outline-light'} position-relative`}
            aria-label="Vai al carrello"
          >
            <i className="bi bi-cart3"></i>
            {totalQuantity > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalQuantity > 99 ? '99+' : totalQuantity}
              </span>
            )}
          </Link>

          <button className="btn btn-dark pt-2" onClick={scrollToFooter} aria-label="Vai ai contatti">
            <i className="bi bi-envelope me-2"></i>
            <span className="h6 text-white d-none d-md-inline">Contact</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = { logoSrc: PropTypes.string, title: PropTypes.string };
export default Navbar;
