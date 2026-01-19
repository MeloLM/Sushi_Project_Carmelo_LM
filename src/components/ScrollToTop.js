import React, { useState, useEffect } from 'react';

/**
 * ScrollToTop - Bottone per tornare in cima alla pagina
 * TODO #3: Appare dopo aver scrollato 300px
 */
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mostra/nascondi bottone in base allo scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top con animazione smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`scroll-to-top-btn ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Torna in cima alla pagina"
      title="Torna su"
    >
      <i className="bi bi-arrow-up"></i>
    </button>
  );
};

export default ScrollToTop;
