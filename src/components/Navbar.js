import React from 'react';
import PropTypes from 'prop-types';
import logo from '../images/sushi.png'

//NavBar Component
function Navbar({ logoSrc = null, title = 'Sushi Project' }){
    const scrollToFooter = () => {
        document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className="navbar navbar-dark bg-transparent" role="navigation" aria-label="Main navigation">
            <div className="container-fluid">
                <span className="navbar-brand mb-0 h1">
                    <img 
                        src={logoSrc || logo} 
                        className="size_sm me-2" 
                        alt={`Logo ${title}`}
                    />
                    <span className='d-inline'>{title}</span>
                </span>

                <button 
                    className='btn btn-dark pt-2' 
                    onClick={scrollToFooter}
                    aria-label="Vai alla sezione contatti"
                >
                    <i className="bi bi-envelope me-2"></i>
                    <span className='h5 text-white'>Contact</span>
                </button>
            </div>
        </nav>
    );
}

Navbar.propTypes = {
    logoSrc: PropTypes.string,
    title: PropTypes.string
};

export default Navbar;