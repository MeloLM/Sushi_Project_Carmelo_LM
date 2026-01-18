import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { useCartContext } from '../context/CartContext';

const HomePage = () => {
  const { cards, incrementItem, decrementItem, maxQuantity } = useCartContext();
  const [activeFilter, setActiveFilter] = useState('all');

  // Categorie disponibili
  const categories = [
    { key: 'all', label: 'Tutti', icon: 'bi-grid-3x3-gap' },
    { key: 'roll', label: 'Roll', icon: 'bi-circle' },
    { key: 'nigiri', label: 'Nigiri', icon: 'bi-square' },
    { key: 'special', label: 'Special', icon: 'bi-star' }
  ];

  // Filtra prodotti per categoria
  const filteredCards = activeFilter === 'all'
    ? cards
    : cards.filter(card => card.categoria === activeFilter);

  return (
    <div className="container min-vh-100 py-4">
      <div className="d-flex justify-content-center align-items-center flex-wrap mb-4">
        <h1 className='text-center text-white me-4'>Cosa desideri ordinare?</h1>
        <Link to="/cart" className="btn btn-secondary cart-button">
          <i className="bi bi-cart3 me-2"></i>
          Vai al Carrello
        </Link>
      </div>

      {/* Filtri categoria */}
      <div className="filter-container text-center my-4">
        {categories.map(cat => (
          <button
            key={cat.key}
            className={`filter-btn mx-1 ${activeFilter === cat.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat.key)}
          >
            <i className={`bi ${cat.icon} me-1`}></i>
            {cat.label}
          </button>
        ))}
      </div>

      <hr className='text-white' />

      <div className="row justify-content-center">
        {filteredCards.map(card => (
          <Card
            key={card.id}
            card={card}
            onDecrement={decrementItem}
            onIncrement={incrementItem}
            maxQuantity={maxQuantity}
          />
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-emoji-frown text-white" style={{ fontSize: '3rem' }}></i>
          <p className="text-white mt-3">Nessun prodotto in questa categoria</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
