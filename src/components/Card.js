import React from 'react';
import PropTypes from 'prop-types';

// TODO #10: Mappa emoji allergeni
const allergeniIcons = {
    crostacei: { emoji: '🦐', label: 'Crostacei' },
    pesce: { emoji: '🐟', label: 'Pesce' },
    latticini: { emoji: '🥛', label: 'Latticini' },
    uova: { emoji: '🥚', label: 'Uova' },
    glutine: { emoji: '🌾', label: 'Glutine' },
    soia: { emoji: '🥜', label: 'Soia' }
};

/**
 * Card Component - Mostra un prodotto sushi
 * TODO #5: Bottone favoriti
 * TODO #8: Badge categoria colorati
 * TODO #10: Icone allergeni
 * TODO #11: Animazione quantità
 * TODO #14: Tooltip sui bottoni
 */
const Card = ({
    card,
    onIncrement,
    onDecrement,
    maxQuantity = 99,
    isFavorite = false,
    onToggleFavorite
}) => {
    const isMaxReached = card.quantita >= maxQuantity;

    return (
        <div className="col-12 col-md-6 col-lg-4 mt-3">
            <div className={`card card-product mx-auto p-2 ${isFavorite ? 'is-favorite' : ''}`}>
                {/* TODO #5: Bottone favorito */}
                {onToggleFavorite && (
                    <button
                        className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                        onClick={() => onToggleFavorite(card.id)}
                        aria-label={isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                        title={isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                    >
                        <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                    </button>
                )}

                <img
                    src={card.img}
                    className="card-img-top"
                    alt={`${card.name} Roll - Sushi`}
                    loading="lazy"
                />
                <div className="card-body">
                    <h5 className="card-title">{card.name} Roll</h5>
                    <p className="card-description">{card.description}</p>

                    {/* TODO #10: Allergeni */}
                    {card.allergeni && card.allergeni.length > 0 && (
                        <div className="allergeni-container mb-2">
                            {card.allergeni.map(allergen => (
                                <span
                                    key={allergen}
                                    className="allergene-icon"
                                    title={allergeniIcons[allergen]?.label || allergen}
                                >
                                    {allergeniIcons[allergen]?.emoji || '⚠️'}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                        <p className="card-price mb-0">{card.prezzo.toFixed(2)} €</p>
                        <div className='quantity-controls-inline'>
                            <button
                                onClick={() => onDecrement(card)}
                                className="btn btn-danger btn-sm"
                                aria-label={`Rimuovi ${card.name} Roll dal carrello`}
                                title="Rimuovi uno" /* TODO #14 */
                                disabled={card.quantita === 0}
                            >
                                <i className="bi bi-dash"></i>
                            </button>
                            {/* TODO #11: Classe per animazione */}
                            <span className={`badge-quantity-inline ${card.quantita > 0 ? 'has-items animate-pulse' : ''}`}>
                                {card.quantita}
                            </span>
                            <button
                                onClick={() => onIncrement(card)}
                                className="btn btn-success btn-sm"
                                aria-label={`Aggiungi ${card.name} Roll al carrello`}
                                title={isMaxReached ? 'Quantità massima raggiunta' : 'Aggiungi uno'} /* TODO #14 */
                                disabled={isMaxReached}
                            >
                                <i className="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
                {/* TODO #8: Badge categoria colorato */}
                <span className={`category-badge-bottom category-${card.categoria}`}>
                    {card.categoria === 'roll' && '🍣 '}
                    {card.categoria === 'nigiri' && '🍙 '}
                    {card.categoria === 'special' && '⭐ '}
                    {card.categoria}
                </span>
            </div>
        </div>
    );
}

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
    onToggleFavorite: PropTypes.func
};

export default Card;