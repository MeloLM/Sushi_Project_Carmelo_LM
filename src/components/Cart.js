import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';

function Cart({ items = [], onReset }) {
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  const handleClose = () => {
    setShow(false);
    setOrderSent(false);
  };
  const handleShow = () => setShow(true);

  let totalQuantity = 0;
  let totalPrice = 0;
  
  items.forEach((item) => {
    totalQuantity += item.quantita;
    totalPrice += item.prezzo * item.quantita;
  });
  
  // Arrotonda il prezzo totale a 2 decimali
  totalPrice = Math.round(totalPrice * 100) / 100;

  // Sistema sconto: 5% ogni 10 pezzi, max 50%
  const discountPercent = Math.min(Math.floor(totalQuantity / 10) * 5, 50);
  const discountAmount = totalPrice * (discountPercent / 100);
  const finalPrice = totalPrice - discountAmount;

  // Gestione conferma ordine
  const handleConfirmOrder = () => {
    setShowConfirm(false);
    setOrderSent(true);
    // Qui si potrebbe integrare con un backend
    setTimeout(() => {
      if (onReset) onReset();
    }, 2000);
  };

  return (
    <>
      <Button variant="secondary" onClick={handleShow} className="cart-button">
        <i className="bi bi-cart3 me-2"></i>
        Menu {totalQuantity > 0 && <Badge bg="light" text="dark" className="cart-badge">{totalQuantity}</Badge>}
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-cart3 me-2"></i>
            Il tuo Ordine
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            {orderSent ? (
              <div className="text-center py-4">
                <i className="bi bi-check-circle text-success" style={{fontSize: '4rem'}}></i>
                <h4 className="mt-3 text-success">Ordine Inviato!</h4>
                <p className="text-muted">Grazie per il tuo ordine. Ti contatteremo presto.</p>
              </div>
            ) : totalQuantity === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-cart-x text-muted" style={{fontSize: '3rem'}}></i>
                <p className="text-muted mt-3">Il carrello è vuoto</p>
              </div>
            ) : (
              <>
                <ul className="cart-list">
                    {items.filter(item => item.quantita > 0).map(item => (
                    <li key={item.id} className="cart-item">
                        <span className="item-name">{item.name} Roll</span>
                        <span className="item-qty">x{item.quantita}</span>
                        <span className="item-price">{(item.prezzo*item.quantita).toFixed(2)}€</span>
                    </li>  
                    ))}
                </ul>
                <hr />
                <div className="cart-summary">
                  <p>Totale pezzi: <strong>{totalQuantity}</strong></p>
                  <p>Subtotale: {totalPrice.toFixed(2)}€</p>
                  {discountPercent > 0 && (
                    <p className="text-success">
                      <i className="bi bi-tag-fill me-1"></i>
                      <strong>Sconto {discountPercent}%: -{discountAmount.toFixed(2)}€</strong>
                    </p>
                  )}
                  <p className="cart-total"><strong>Totale: {finalPrice.toFixed(2)}€</strong></p>
                </div>
              </>
            )}
        </Modal.Body>

        <Modal.Footer>
          {!orderSent && totalQuantity > 0 && onReset && (
            <Button variant="outline-danger" onClick={onReset}>
              <i className="bi bi-trash me-1"></i>
              Svuota
            </Button>
          )}
          {!orderSent && totalQuantity > 0 && (
            <Button variant="success" onClick={() => setShowConfirm(true)}>
              <i className="bi bi-check2 me-1"></i>
              Invia Ordine
            </Button>
          )}
          <Button variant="secondary" onClick={handleClose}>
            {orderSent ? 'Chiudi' : 'Continua'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modale Conferma */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Conferma Ordine</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Vuoi confermare l'ordine di <strong>{totalQuantity} pezzi</strong>?</p>
          <p className="h4 text-success">{finalPrice.toFixed(2)}€</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowConfirm(false)}>
            Annulla
          </Button>
          <Button variant="success" onClick={handleConfirmOrder}>
            Conferma
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

Cart.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      prezzo: PropTypes.number.isRequired,
      quantita: PropTypes.number.isRequired
    })
  ).isRequired,
  onReset: PropTypes.func
};

export default Cart;