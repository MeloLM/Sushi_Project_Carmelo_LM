import React from 'react';
import PropTypes from 'prop-types';

const allergeniIcons = {
  crostacei: { emoji: '🦐', label: 'Crostacei' },
  pesce: { emoji: '🐟', label: 'Pesce' },
  latticini: { emoji: '🥛', label: 'Latticini' },
  uova: { emoji: '🥚', label: 'Uova' },
  glutine: { emoji: '🌾', label: 'Glutine' },
  soia: { emoji: '🥜', label: 'Soia' }
};

const StarDisplay = ({ value }) => (
  <div className="star-display">
    {[1, 2, 3, 4, 5].map(s => (
      <i key={s} className={`bi ${value >= s ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`} style={{ fontSize: '0.7rem' }}></i>
    ))}
  </div>
);

const Card = ({ card, onIncrement, onDecrement, maxQuantity = 99, isFavorite = false, onToggleFavorite, onCardClick, rating }) => {
  const isMaxReached = card.quantita >= maxQuantity;

  return (
    <div className="col-12 col-md-6 col-lg-4 mt-3">
      <div className={`card card-product mx-auto p-2 ${isFavorite ? 'is-favorite' : ''}`}>
        {onToggleFavorite && (
          <button
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(card.id)}
            aria-label={isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
          >
            <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
          </button>
        )}

        <img
          src={card.img}
          className="card-img-top"
          alt={`${card.name} Roll`}
          loading="lazy"
          onClick={() => onCardClick?.(card)}
          style={{ cursor: onCardClick ? 'pointer' : 'default' }}
        />

        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <h5
              className="card-title mb-0"
              onClick={() => onCardClick?.(card)}
              style={{ cursor: onCardClick ? 'pointer' : 'default' }}
            >
              {card.name} Roll
            </h5>
            {rating?.avg && (
              <div className="d-flex align-items-center gap-1">
                <StarDisplay value={Math.round(rating.avg)} />
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>({rating.count})</small>
              </div>
            )}
          </div>

          <p className="card-description">{card.description}</p>

          {card.allergeni?.length > 0 && (
            <div className="allergeni-container mb-2">
              {card.allergeni.map(allergen => (
                <span key={allergen} className="allergene-icon" title={allergeniIcons[allergen]?.label || allergen}>
                  {allergeniIcons[allergen]?.emoji || '⚠️'}
                </span>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <p className="card-price mb-0">{card.prezzo.toFixed(2)} €</p>
            <div className="quantity-controls-inline">
              <button onClick={() => onDecrement(card)} className="btn btn-danger btn-sm" disabled={card.quantita === 0} aria-label="Rimuovi">
                <i className="bi bi-dash"></i>
              </button>
              <span className={`badge-quantity-inline ${card.quantita > 0 ? 'has-items animate-pulse' : ''}`}>
                {card.quantita}
              </span>
              <button onClick={() => onIncrement(card)} className="btn btn-success btn-sm" disabled={isMaxReached} aria-label="Aggiungi">
                <i className="bi bi-plus"></i>
              </button>
            </div>
          </div>
        </div>

        <span className={`category-badge-bottom category-${card.categoria}`}>
          {card.categoria === 'roll' && '🍣 '}
          {card.categoria === 'nigiri' && '🍙 '}
          {card.categoria === 'special' && '⭐ '}
          {card.categoria}
        </span>
      </div>
    </div>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    prezzo: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
    quantita: PropTypes.number.isRequired,
    categoria: PropTypes.string,
    description: PropTypes.string,
    allergeni: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
  maxQuantity: PropTypes.number,
  isFavorite: PropTypes.bool,
  onToggleFavorite: PropTypes.func,
  onCardClick: PropTypes.func,
  rating: PropTypes.shape({ avg: PropTypes.number, count: PropTypes.number })
};

export default Card;
