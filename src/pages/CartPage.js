import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import Breadcrumb from '../components/Breadcrumb';

/**
 * CartPage - Pagina carrello dedicata
 * TODO #7: Modale conferma svuota carrello
 * TODO #9: Stima tempo consegna dinamica
 * TODO #12: Breadcrumb
 */
const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    totalQuantity,
    totalPrice,
    discountPercent,
    discountAmount,
    finalPrice,
    resetCart,
    incrementItem,
    decrementItem
  } = useCartContext();

  // TODO #7: State per modale conferma
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleCheckout = () => {
    if (totalQuantity > 0) {
      navigate('/checkout');
    }
  };

  // TODO #7: Gestione svuota carrello con conferma
  const handleResetCart = () => {
    setShowConfirmModal(true);
  };

  const confirmResetCart = () => {
    resetCart();
    setShowConfirmModal(false);
  };

  // TODO #9: Calcola stima tempo consegna in base alla quantità
  const getDeliveryEstimate = () => {
    if (totalQuantity <= 5) return '20-30';
    if (totalQuantity <= 15) return '30-45';
    if (totalQuantity <= 30) return '45-60';
    return '60-90';
  };

  return (
    <div className="container py-5">
      {/* TODO #12: Breadcrumb */}
      <Breadcrumb />

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card cart-page-card">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
              <h2 className="mb-0">
                <i className="bi bi-cart3 me-2"></i>
                Il tuo Carrello
              </h2>
              <Link to="/" className="btn btn-outline-light btn-sm">
                <i className="bi bi-arrow-left me-1"></i>
                Continua a ordinare
              </Link>
            </div>

            <div className="card-body">
              {totalQuantity === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }}></i>
                  <h4 className="mt-3 text-muted">Il carrello è vuoto</h4>
                  <p className="text-muted">Aggiungi qualche delizioso sushi!</p>
                  <Link to="/" className="btn btn-primary mt-3">
                    <i className="bi bi-shop me-2"></i>
                    Vai al Menu
                  </Link>
                </div>
              ) : (
                <>
                  <ul className="list-group list-group-flush">
                    {cartItems.map(item => (
                      <li key={item.id} className="list-group-item cart-page-item cart-item-animate">
                        <div className="row align-items-center">
                          <div className="col-3 col-md-2">
                            <img
                              src={item.img}
                              alt={item.name}
                              className="img-fluid rounded"
                              style={{ maxHeight: '60px', objectFit: 'cover' }}
                            />
                          </div>
                          <div className="col-5 col-md-4">
                            <h6 className="mb-1">{item.name} Roll</h6>
                            <small className="text-muted">{item.prezzo.toFixed(2)}€ cad.</small>
                          </div>
                          <div className="col-4 col-md-3 text-center">
                            <div className="quantity-controls-inline">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => decrementItem(item)}
                                title="Rimuovi uno"
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <span className="mx-2 fw-bold quantity-badge">{item.quantita}</span>
                              <button
                                className="btn btn-outline-success btn-sm"
                                onClick={() => incrementItem(item)}
                                title="Aggiungi uno"
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                          </div>
                          <div className="col-12 col-md-3 text-end mt-2 mt-md-0">
                            <span className="fw-bold text-success">
                              {(item.prezzo * item.quantita).toFixed(2)}€
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <hr />

                  <div className="cart-summary p-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotale ({totalQuantity} pezzi):</span>
                      <span>{totalPrice.toFixed(2)}€</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>
                          <i className="bi bi-tag-fill me-1"></i>
                          Sconto {discountPercent}%:
                        </span>
                        <span>-{discountAmount.toFixed(2)}€</span>
                      </div>
                    )}

                    <hr />

                    <div className="d-flex justify-content-between mb-0">
                      <span className="h5 mb-0">Totale:</span>
                      <span className="h5 mb-0 text-success fw-bold">{finalPrice.toFixed(2)}€</span>
                    </div>

                    {/* TODO #9: Stima tempo consegna dinamica */}
                    <div className="delivery-estimate mt-3 p-2 bg-light rounded">
                      <i className="bi bi-clock me-2 text-primary"></i>
                      <span className="text-muted">
                        Tempo di consegna stimato: <strong>{getDeliveryEstimate()} minuti</strong>
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {totalQuantity > 0 && (
              <div className="card-footer bg-light">
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-outline-danger"
                    onClick={handleResetCart}
                  >
                    <i className="bi bi-trash me-1"></i>
                    Svuota Carrello
                  </button>
                  <button
                    className="btn btn-success btn-lg"
                    onClick={handleCheckout}
                  >
                    <i className="bi bi-check2-circle me-2"></i>
                    Procedi al Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TODO #7: Modale conferma svuota carrello */}
      {showConfirmModal && (
        <div className="confirm-modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal-header">
              <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
              <h5 className="mb-0">Conferma</h5>
            </div>
            <div className="confirm-modal-body">
              <p>Sei sicuro di voler svuotare il carrello?</p>
              <p className="text-muted small">Questa azione rimuoverà tutti i {totalQuantity} prodotti.</p>
            </div>
            <div className="confirm-modal-footer">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Annulla
              </button>
              <button
                className="btn btn-danger"
                onClick={confirmResetCart}
              >
                <i className="bi bi-trash me-1"></i>
                Svuota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
