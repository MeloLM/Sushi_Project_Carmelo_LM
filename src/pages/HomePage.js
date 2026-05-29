import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Breadcrumb, ProductModal } from '../components';
import { useCartContext } from '../context';
import { useAllRatings } from '../hooks/useRatings';

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

const ALL_ALLERGENI = ['crostacei', 'pesce', 'latticini', 'uova', 'glutine', 'soia'];
const ALLERGENI_LABELS = {
  crostacei: '🦐 Crostacei', pesce: '🐟 Pesce', latticini: '🥛 Latticini',
  uova: '🥚 Uova', glutine: '🌾 Glutine', soia: '🥜 Soia'
};

const MIN_PRICE = 1;
const MAX_PRICE = 5;

const HomePage = () => {
  const { cards, incrementItem, decrementItem, maxQuantity, toggleFavorite, isFavorite, isLoading } = useCartContext();
  const allRatings = useAllRatings();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [maxPriceFilter, setMaxPriceFilter] = useState(MAX_PRICE);
  const [excludedAllergeni, setExcludedAllergeni] = useState([]);

  const categories = [
    { key: 'all', label: 'Tutti', icon: 'bi-grid-3x3-gap' },
    { key: 'roll', label: 'Roll', icon: 'bi-circle' },
    { key: 'nigiri', label: 'Nigiri', icon: 'bi-square' },
    { key: 'special', label: 'Special', icon: 'bi-star' }
  ];

  const toggleAllergen = (allergen) => {
    setExcludedAllergeni(prev =>
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
  };

  const filteredCards = cards.filter(card => {
    const matchesCategory = activeFilter === 'all' || card.categoria === activeFilter;
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = !showFavoritesOnly || isFavorite(card.id);
    const matchesPrice = card.prezzo <= maxPriceFilter;
    const matchesAllergeni = excludedAllergeni.length === 0 ||
      !card.allergeni?.some(a => excludedAllergeni.includes(a));
    return matchesCategory && matchesSearch && matchesFavorites && matchesPrice && matchesAllergeni;
  });

  const activeFiltersCount = (maxPriceFilter < MAX_PRICE ? 1 : 0) + excludedAllergeni.length;

  return (
    <div className="container min-vh-100 py-4">
      <Breadcrumb />

      {/* ── Hero: Custom Box Builder CTA ─────────────────────────────────────── */}
      <div className="p-4 p-md-5 mb-5 rounded-3 bg-dark border border-warning border-opacity-50">
        <div className="row align-items-center g-4">
          <div className="col-md-8">
            <h2 className="fw-bold text-white mb-2">
              Costruisci la tua{' '}
              <span className="text-warning">Custom Box</span> 🎊
            </h2>
            <p className="text-muted mb-3">
              Personalizza il tuo assortimento di sushi per feste e occasioni speciali.
              Scegli tra 3 taglie, componi le porzioni liberamente — il prezzo è fisso.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link
                to="/box-builder"
                className="btn btn-warning btn-lg fw-semibold"
                aria-label="Crea il tuo Custom Box personalizzato"
              >
                <i className="bi bi-box-seam-fill me-2" aria-hidden="true"></i>
                Crea il tuo Custom Box
              </Link>
              <span className="d-flex align-items-center gap-3">
                <span className="text-muted small">📦 20 pz · €25</span>
                <span className="text-muted small">🎁 50 pz · €55</span>
                <span className="text-muted small">🎊 80 pz · €85</span>
              </span>
            </div>
          </div>
          <div className="col-md-4 text-center d-none d-md-block">
            <img
              src={require('../images/boxSushiMain.png')}
              alt="Custom Box di sushi"
              style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain', borderRadius: '12px' }}
            />
          </div>
        </div>
      </div>

      {/* ── A la Carte ─────────────────────────────────────────────────────── */}
      <div className="d-flex justify-content-center align-items-center flex-wrap mb-4">
        <h1 className="text-center text-white me-4">Cosa desideri ordinare?</h1>
        <Link to="/cart" className="btn btn-secondary cart-button">
          <i className="bi bi-cart3 me-2"></i>
          Vai al Carrello
        </Link>
      </div>

      {/* Ricerca */}
      <div className="search-container mb-3">
        <div className="input-group">
          <span className="input-group-text bg-dark text-white border-0"><i className="bi bi-search"></i></span>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Cerca sushi..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="btn btn-outline-light" onClick={() => setSearchQuery('')}>
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>

      {/* Filtri avanzati */}
      <div className="advanced-filters-panel mb-3">
        <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
          <span className="text-white small fw-bold">
            <i className="bi bi-sliders me-1"></i>Filtri avanzati
            {activeFiltersCount > 0 && <span className="badge bg-danger ms-1">{activeFiltersCount}</span>}
          </span>

          <div className="d-flex align-items-center gap-2 ms-2">
            <small className="text-white-50">Prezzo max:</small>
            <input
              type="range"
              className="price-range-slider"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={0.1}
              value={maxPriceFilter}
              onChange={e => setMaxPriceFilter(parseFloat(e.target.value))}
            />
            <small className="text-warning fw-bold">{maxPriceFilter.toFixed(2)}€</small>
            {maxPriceFilter < MAX_PRICE && (
              <button className="btn btn-outline-light btn-sm py-0" onClick={() => setMaxPriceFilter(MAX_PRICE)}>
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>

        <div className="d-flex align-items-center gap-1 flex-wrap">
          <small className="text-white-50 me-1">Escludi allergeni:</small>
          {ALL_ALLERGENI.map(a => (
            <button
              key={a}
              className={`allergen-filter-pill ${excludedAllergeni.includes(a) ? 'active' : ''}`}
              onClick={() => toggleAllergen(a)}
            >
              {ALLERGENI_LABELS[a]}
            </button>
          ))}
        </div>
      </div>

      {/* Categorie + Preferiti */}
      <div className="filter-container d-flex justify-content-between align-items-center flex-wrap my-4">
        <div>
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
        <button
          className={`filter-btn ms-auto filter-favorites ${showFavoritesOnly ? 'active' : ''}`}
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          title="Mostra solo preferiti"
        >
          <i className={`bi ${showFavoritesOnly ? 'bi-heart-fill' : 'bi-heart'} me-1`}></i>
          Preferiti
        </button>
      </div>

      <hr className="text-white" />

      {isLoading ? (
        <div className="row justify-content-center">
          {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
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
              onCardClick={setSelectedProduct}
              rating={allRatings[String(card.id)]}
            />
          ))}
        </div>
      )}

      {!isLoading && filteredCards.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-emoji-frown text-white" style={{ fontSize: '3rem' }}></i>
          <p className="text-white mt-3">
            {showFavoritesOnly ? 'Non hai ancora prodotti preferiti'
              : searchQuery ? `Nessun risultato per "${searchQuery}"`
              : 'Nessun prodotto in questa categoria'}
          </p>
          {(showFavoritesOnly || searchQuery || activeFiltersCount > 0) && (
            <button
              className="btn btn-outline-light mt-2"
              onClick={() => { setShowFavoritesOnly(false); setSearchQuery(''); setMaxPriceFilter(MAX_PRICE); setExcludedAllergeni([]); }}
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i>
              Mostra tutti
            </button>
          )}
        </div>
      )}

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};

export default HomePage;
