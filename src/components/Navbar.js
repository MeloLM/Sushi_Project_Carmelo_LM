import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/sushi.png';
import { useTheme } from '../context/ThemeContext';
import { useCartContext } from '../context/CartContext';

//NavBar Component
function Navbar({ logoSrc = null, title = 'Sushi Project' }){
    const location = useLocation();
    const { darkMode, toggleDarkMode } = useTheme();
    const { totalQuantity } = useCartContext();

    const scrollToFooter = () => {
        document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className="navbar navbar-dark bg-transparent" role="navigation" aria-label="Main navigation">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand mb-0 h1 text-decoration-none">
                    <img 
                        src={logoSrc || logo} 
                        className="size_sm me-2" 
                        alt={`Logo ${title}`}
                    />
                    <span className='d-inline'>{title}</span>
                </Link>

                <div className="d-flex align-items-center gap-2">
                    {/* Dark Mode Toggle */}
                    <button 
                        className="btn btn-outline-light"
                        onClick={toggleDarkMode}
                        aria-label={darkMode ? 'Passa a tema chiaro' : 'Passa a tema scuro'}
                        title={darkMode ? 'Tema chiaro' : 'Tema scuro'}
                    >
                        <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
                    </button>

                    {/* Link Carrello */}
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

                    {/* Contact Button */}
                    <button 
                        className='btn btn-dark pt-2' 
                        onClick={scrollToFooter}
                        aria-label="Vai alla sezione contatti"
                    >
                        <i className="bi bi-envelope me-2"></i>
                        <span className='h6 text-white d-none d-md-inline'>Contact</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}

Navbar.propTypes = {
    logoSrc: PropTypes.string,
    title: PropTypes.string
};

export default Navbar;