import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    totalQuantity,
    finalPrice,
    discountPercent,
    resetCart,
    showToast
  } = useCartContext();

  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    indirizzo: '',
    citta: '',
    cap: '',
    note: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Validazione form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome obbligatorio';
    if (!formData.cognome.trim()) newErrors.cognome = 'Cognome obbligatorio';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email obbligatoria';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Telefono obbligatorio';
    } else if (!/^[\d\s+()-]{8,}$/.test(formData.telefono)) {
      newErrors.telefono = 'Formato telefono non valido';
    }

    if (!formData.indirizzo.trim()) newErrors.indirizzo = 'Indirizzo obbligatorio';
    if (!formData.citta.trim()) newErrors.citta = 'Città obbligatoria';
    
    if (!formData.cap.trim()) {
      newErrors.cap = 'CAP obbligatorio';
    } else if (!/^\d{5}$/.test(formData.cap)) {
      newErrors.cap = 'CAP deve essere di 5 cifre';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Rimuovi errore quando l'utente inizia a digitare
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Compila tutti i campi obbligatori', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simula invio ordine
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Genera numero ordine
    const orderNum = `SU${Date.now().toString().slice(-8)}`;
    setOrderNumber(orderNum);
    setOrderComplete(true);
    
    // Reset carrello dopo 3 secondi
    setTimeout(() => {
      resetCart();
    }, 3000);

    setIsSubmitting(false);
  };

  // Redirect se carrello vuoto e non ordine completato
  if (totalQuantity === 0 && !orderComplete) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 text-center">
            <div className="card p-5">
              <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }}></i>
              <h3 className="mt-3">Carrello vuoto</h3>
              <p className="text-muted">Aggiungi prodotti prima di procedere al checkout</p>
              <Link to="/" className="btn btn-primary mt-3">
                <i className="bi bi-shop me-2"></i>
                Vai al Menu
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Schermata ordine completato
  if (orderComplete) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card order-success-card text-center p-5">
              <div className="success-checkmark">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
              </div>
              <h2 className="mt-4 text-success">Ordine Confermato!</h2>
              <p className="lead">Grazie per il tuo ordine, {formData.nome}!</p>
              
              <div className="order-details bg-light rounded p-4 my-4">
                <p className="mb-2">
                  <strong>Numero Ordine:</strong>
                  <br />
                  <span className="h4 text-primary">{orderNumber}</span>
                </p>
                <p className="mb-0 text-muted">
                  Riceverai una conferma via email a {formData.email}
                </p>
              </div>

              <div className="d-grid gap-2">
                <Link to="/" className="btn btn-primary btn-lg">
                  <i className="bi bi-shop me-2"></i>
                  Torna al Menu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        {/* Form Checkout */}
        <div className="col-12 col-lg-7 mb-4">
          <div className="card checkout-form-card">
            <div className="card-header bg-dark text-white">
              <h3 className="mb-0">
                <i className="bi bi-truck me-2"></i>
                Dati per la Consegna
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nome *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      placeholder="Mario"
                    />
                    {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Cognome *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cognome ? 'is-invalid' : ''}`}
                      name="cognome"
                      value={formData.cognome}
                      onChange={handleChange}
                      placeholder="Rossi"
                    />
                    {errors.cognome && <div className="invalid-feedback">{errors.cognome}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="mario.rossi@email.com"
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Telefono *</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+39 333 1234567"
                    />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Indirizzo *</label>
                  <input
                    type="text"
                    className={`form-control ${errors.indirizzo ? 'is-invalid' : ''}`}
                    name="indirizzo"
                    value={formData.indirizzo}
                    onChange={handleChange}
                    placeholder="Via Roma, 123"
                  />
                  {errors.indirizzo && <div className="invalid-feedback">{errors.indirizzo}</div>}
                </div>

                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label className="form-label">Città *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.citta ? 'is-invalid' : ''}`}
                      name="citta"
                      value={formData.citta}
                      onChange={handleChange}
                      placeholder="Milano"
                    />
                    {errors.citta && <div className="invalid-feedback">{errors.citta}</div>}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">CAP *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cap ? 'is-invalid' : ''}`}
                      name="cap"
                      value={formData.cap}
                      onChange={handleChange}
                      placeholder="20100"
                      maxLength="5"
                    />
                    {errors.cap && <div className="invalid-feedback">{errors.cap}</div>}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Note aggiuntive</label>
                  <textarea
                    className="form-control"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Citofono, piano, allergie..."
                  ></textarea>
                </div>

                <div className="d-flex justify-content-between">
                  <Link to="/cart" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-1"></i>
                    Torna al Carrello
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Invio in corso...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-2"></i>
                        Conferma Ordine
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Riepilogo Ordine */}
        <div className="col-12 col-lg-5">
          <div className="card checkout-summary-card sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-secondary text-white">
              <h4 className="mb-0">
                <i className="bi bi-receipt me-2"></i>
                Riepilogo Ordine
              </h4>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                {cartItems.map(item => (
                  <li key={item.id} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                    <span>
                      {item.name} Roll
                      <small className="text-muted ms-1">x{item.quantita}</small>
                    </span>
                    <span className="fw-bold">{(item.prezzo * item.quantita).toFixed(2)}€</span>
                  </li>
                ))}
              </ul>

              <hr />

              {discountPercent > 0 && (
                <div className="d-flex justify-content-between text-success mb-2">
                  <span>
                    <i className="bi bi-tag-fill me-1"></i>
                    Sconto {discountPercent}%
                  </span>
                  <span>-{((finalPrice / (1 - discountPercent / 100)) - finalPrice).toFixed(2)}€</span>
                </div>
              )}

              <div className="d-flex justify-content-between">
                <span className="h5">Totale:</span>
                <span className="h4 text-success fw-bold">{finalPrice.toFixed(2)}€</span>
              </div>

              <hr />

              <div className="text-muted small">
                <p className="mb-1">
                  <i className="bi bi-clock me-1"></i>
                  Consegna stimata: 30-45 minuti
                </p>
                <p className="mb-0">
                  <i className="bi bi-credit-card me-1"></i>
                  Pagamento alla consegna
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
