import React from 'react';
import PropTypes from 'prop-types';

//Card Component
const Card = ({ card, onIncrement, onDecrement, maxQuantity = 99 }) => {
    const isMaxReached = card.quantita >= maxQuantity;

    return (
        <div className="col-12 col-md-6 col-lg-4 mt-3">
            <div className="card card-product mx-auto p-2">
                <img 
                    src={card.img} 
                    className="card-img-top" 
                    alt={`${card.name} Roll - Sushi`}
                    loading="lazy"
                />
                <div className="card-body">
                    <h5 className="card-title">{card.name} Roll</h5>
                    <p className="card-description">{card.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                        <p className="card-price mb-0">{card.prezzo.toFixed(2)} €</p>
                        <div className='quantity-controls-inline'>
                            <button 
                                onClick={() => onDecrement(card)} 
                                className="btn btn-danger btn-sm"
                                aria-label={`Rimuovi ${card.name} Roll dal carrello`}
                                disabled={card.quantita === 0}
                            >
                                <i className="bi bi-dash"></i>
                            </button>
                            <span className={`badge-quantity-inline ${card.quantita > 0 ? 'has-items' : ''}`}>
                                {card.quantita}
                            </span>
                            <button 
                                onClick={() => onIncrement(card)} 
                                className="btn btn-success btn-sm"
                                aria-label={`Aggiungi ${card.name} Roll al carrello`}
                                disabled={isMaxReached}
                            >
                                <i className="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
                {/* Badge categoria */}
                <span className={`category-badge-bottom category-${card.categoria}`}>
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
        description: PropTypes.string
    }).isRequired,
    onIncrement: PropTypes.func.isRequired,
    onDecrement: PropTypes.func.isRequired,
    maxQuantity: PropTypes.number
};
    
export default Card;