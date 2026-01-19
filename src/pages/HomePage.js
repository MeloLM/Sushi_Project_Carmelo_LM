import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Breadcrumb from '../components/Breadcrumb';
import { useCartContext } from '../context/CartContext';

/**
 * TODO #4: Componente Skeleton per loading
 */
const SkeletonCard = () => (
  <div className="col-12 col-md-6 col-lg-4 mt-3">
    <div className="card card-product mx-auto p-2 skeleton-card">
      <div className="skeleton skeleton-img"></div>
      <div className="card-body">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text short"></div>
      </div>
    </div>
  </div>
);

/**
 * HomePage - Pagina principale con griglia prodotti
 * TODO #4: Skeleton loading
 * TODO #5: Filtro favoriti
 * TODO #6: Ricerca prodotti
 * TODO #12: Breadcrumb
 */
const HomePage = () => {
  const {
    cards,
    incrementItem,
    decrementItem,
    maxQuantity,
    toggleFavorite,
    isFavorite
  } = useCartContext();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); // TODO #6
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false); // TODO #5
  const [isLoading, setIsLoading] = useState(true); // TODO #4

  // Simula caricamento iniziale
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Categorie disponibili
  const categories = [
    { key: 'all', label: 'Tutti', icon: 'bi-grid-3x3-gap' },
    { key: 'roll', label: 'Roll', icon: 'bi-circle' },
    { key: 'nigiri', label: 'Nigiri', icon: 'bi-square' },
    { key: 'special', label: 'Special', icon: 'bi-star' }
  ];

  // Filtra prodotti per categoria, ricerca e preferiti
  const filteredCards = cards.filter(card => {
    // Filtro categoria
    const matchesCategory = activeFilter === 'all' || card.categoria === activeFilter;

    // TODO #6: Filtro ricerca
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase());

    // TODO #5: Filtro favoriti
    const matchesFavorites = !showFavoritesOnly || isFavorite(card.id);

    return matchesCategory && matchesSearch && matchesFavorites;
  });

  return (
    <div className="container min-vh-100 py-4">
      {/* TODO #12: Breadcrumb */}
      <Breadcrumb />

      <div className="d-flex justify-content-center align-items-center flex-wrap mb-4">
        <h1 className='text-center text-white me-4'>Cosa desideri ordinare?</h1>
        <Link to="/cart" className="btn btn-secondary cart-button">
          <i className="bi bi-cart3 me-2"></i>
          Vai al Carrello
        </Link>
      </div>

      {/* TODO #6: Barra di ricerca */}
      <div className="search-container mb-4">
        <div className="input-group">
          <span className="input-group-text bg-dark text-white border-0">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Cerca sushi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Cerca prodotti"
          />
          {searchQuery && (
            <button
              className="btn btn-outline-light"
              onClick={() => setSearchQuery('')}
              aria-label="Cancella ricerca"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>

      {/* Filtri categoria + Favoriti */}
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

        {/* TODO #5: Bottone filtro favoriti */}
        <button
          className={`filter-btn mx-1 filter-favorites ${showFavoritesOnly ? 'active' : ''}`}
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          title="Mostra solo preferiti"
        >
          <i className={`bi ${showFavoritesOnly ? 'bi-heart-fill' : 'bi-heart'} me-1`}></i>
          Preferiti
        </button>
      </div>

      <hr className='text-white' />

      {/* TODO #4: Skeleton loading */}
      {isLoading ? (
        <div className="row justify-content-center">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : (
        <div className="row justify-content-center">
          {filteredCards.map(card => (
            <Card
              key={card.id}
              card={card}
              onDecrement={decrementItem}
              onIncrement={incrementItem}
              maxQuantity={maxQuantity}
              isFavorite={isFavorite(card.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      {!isLoading && filteredCards.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-emoji-frown text-white" style={{ fontSize: '3rem' }}></i>
          <p className="text-white mt-3">
            {showFavoritesOnly
              ? 'Non hai ancora prodotti preferiti'
              : searchQuery
                ? `Nessun risultato per "${searchQuery}"`
                : 'Nessun prodotto in questa categoria'}
          </p>
          {(showFavoritesOnly || searchQuery) && (
            <button
              className="btn btn-outline-light mt-2"
              onClick={() => {
                setShowFavoritesOnly(false);
                setSearchQuery('');
              }}
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i>
              Mostra tutti
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;

