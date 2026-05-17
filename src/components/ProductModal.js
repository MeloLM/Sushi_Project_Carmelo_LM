import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRatings } from '../hooks/useRatings';

const allergeniIcons = {
  crostacei: { emoji: '🦐', label: 'Crostacei' },
  pesce: { emoji: '🐟', label: 'Pesce' },
  latticini: { emoji: '🥛', label: 'Latticini' },
  uova: { emoji: '🥚', label: 'Uova' },
  glutine: { emoji: '🌾', label: 'Glutine' },
  soia: { emoji: '🥜', label: 'Soia' }
};

const StarSelector = ({ value, onSelect, readonly = false }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={`star-btn ${(hovered || value) >= star ? 'active' : ''}`}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => !readonly && onSelect?.(star)}
          disabled={readonly}
          aria-label={`${star} stelle`}
        >
          <i className={`bi ${(hovered || value) >= star ? 'bi-star-fill' : 'bi-star'}`}></i>
        </button>
      ))}
    </div>
  );
};

const ProductModal = ({ product, onClose }) => {
  const [selectedStars, setSelectedStars] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { averageRating, ratingCount, loading, submitRating, hasRated } = useRatings(product.id);
  const alreadyRated = hasRated();

  const handleSubmitRating = async () => {
    if (selectedStars === 0) return;
    const { error } = await submitRating(selectedStars, comment);
    if (!error) setSubmitted(true);
  };

  return (
    <div className="product-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="product-modal-content" onClick={e => e.stopPropagation()}>
        <button className="product-modal-close" onClick={onClose} aria-label="Chiudi">
          <i className="bi bi-x-lg"></i>
        </button>

        <div className="product-modal-img-wrapper">
          <img src={product.img} alt={`${product.name} Roll`} className="product-modal-img" />
        </div>

        <div className="product-modal-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h3 className="product-modal-title">{product.name} Roll</h3>
            <span className="product-modal-price">{product.prezzo.toFixed(2)}€</span>
          </div>

          <p className="product-modal-description">{product.description}</p>

          {product.allergeni?.length > 0 && (
            <div className="mb-3">
              <small className="text-muted fw-bold d-block mb-1">Allergeni:</small>
              {product.allergeni.map(a => (
                <span key={a} className="allergene-tag me-1">
                  {allergeniIcons[a]?.emoji} {allergeniIcons[a]?.label}
                </span>
              ))}
            </div>
          )}

          <hr />

          <div className="d-flex align-items-center gap-2 mb-3">
            <StarSelector value={Math.round(averageRating || 0)} readonly />
            <span className="text-muted small">
              {averageRating
                ? `${averageRating}/5 (${ratingCount} ${ratingCount === 1 ? 'recensione' : 'recensioni'})`
                : 'Nessuna recensione ancora'}
            </span>
          </div>

          {!alreadyRated && !submitted ? (
            <div className="rating-form">
              <p className="fw-bold mb-2 small">Lascia la tua valutazione:</p>
              <StarSelector value={selectedStars} onSelect={setSelectedStars} />
              {selectedStars > 0 && (
                <>
                  <textarea
                    className="form-control mt-2"
                    rows={2}
                    placeholder="Commento opzionale..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                  />
                  <button
                    className="btn btn-primary btn-sm mt-2"
                    onClick={handleSubmitRating}
                    disabled={loading}
                  >
                    {loading && <span className="spinner-border spinner-border-sm me-1" />}
                    Invia valutazione
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-success small">
              <i className="bi bi-check-circle me-1"></i>
              {submitted ? 'Grazie per la tua valutazione!' : 'Hai già valutato questo prodotto'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ProductModal.propTypes = {
  product: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ProductModal;
