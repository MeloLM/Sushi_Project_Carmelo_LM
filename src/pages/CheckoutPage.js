import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import { usePWANotifications } from '../hooks/usePWANotifications';
import { useCoupon } from '../hooks/useCoupon';

const CheckoutPage = () => {
  const {
    cartItems, totalQuantity, finalPrice, discountPercent,
    coupon, couponDiscountAmount, discountAmount,
    resetCart, showToast, addPoints, totalOrders,
    // customBoxItems è disponibile nel context — usalo in handleSupabaseInsert
    // quando integrerai il salvataggio su Supabase.
  } = useCartContext();

  const { permission, requestPermission, sendOrderNotification } = usePWANotifications();
  const { incrementCouponUsage } = useCoupon();

  const [formData, setFormData] = useState({ nome: '', cognome: '', email: '', telefono: '', indirizzo: '', citta: '', cap: '', note: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [earnedPoints, setEarnedPoints] = useState(0);

  const validateForm = () => {
    const e = {};
    if (!formData.nome.trim()) e.nome = 'Nome obbligatorio';
    if (!formData.cognome.trim()) e.cognome = 'Cognome obbligatorio';
    if (!formData.email.trim()) e.email = 'Email obbligatoria';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Email non valida';
    if (!formData.telefono.trim()) e.telefono = 'Telefono obbligatorio';
    else if (!/^[\d\s+()-]{8,}$/.test(formData.telefono)) e.telefono = 'Formato non valido';
    if (!formData.indirizzo.trim()) e.indirizzo = 'Indirizzo obbligatorio';
    if (!formData.citta.trim()) e.citta = 'Città obbligatoria';
    if (!formData.cap.trim()) e.cap = 'CAP obbligatorio';
    else if (!/^\d{5}$/.test(formData.cap)) e.cap = 'CAP di 5 cifre';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ─── PREDISPOSIZIONE SUPABASE ─────────────────────────────────────────────────────────────────
  // Questa funzione mostra COME inserire le righe d'ordine su Supabase.
  // Da integrare all'interno di handleSubmit dopo la conferma del pagamento.
  //
  // Schema tabella `order_items` (PostgreSQL / Supabase):
  //   id           UUID PRIMARY KEY DEFAULT gen_random_uuid()
  //   order_id     UUID REFERENCES orders(id)
  //   product_id   TEXT              -- null per Custom Box
  //   name         TEXT NOT NULL
  //   price        NUMERIC(8,2)
  //   quantity     INT
  //   is_custom_box BOOLEAN DEFAULT false
  //   customizations JSONB           -- null per prodotti classici
  //
  // const handleSupabaseInsert = async (orderId) => {
  //   const { supabase } = await import('../lib/supabase');
  //
  //   // 1. Prodotti à-la-carte — struttura classica, customizations = null
  //   const regularRows = cartItems.map(item => ({
  //     order_id:       orderId,
  //     product_id:     item.id,
  //     name:           item.name,
  //     price:          item.prezzo,
  //     quantity:       item.quantita,
  //     is_custom_box:  false,
  //     customizations: null,
  //   }));
  //
  //   // 2. Custom Box — l'array `customizations` viene passato direttamente
  //   //    a PostgreSQL come JSONB: Supabase serializza l'oggetto JS automaticamente.
  //   //    Struttura JSONB salvata:
  //   //    [
  //   //      { productId, productName, type, portionCount, piecesPerPortion, totalPieces },
  //   //      ...
  //   //    ]
  //   const customBoxRows = customBoxItems.map(box => ({
  //     order_id:       orderId,
  //     product_id:     null,          // nessun ID fisso nel catalogo
  //     name:           box.name,
  //     price:          box.price,
  //     quantity:       box.quantity,
  //     is_custom_box:  true,
  //     customizations: box.customizations,  // <-- colonna JSONB
  //   }));
  //
  //   const { error } = await supabase
  //     .from('order_items')
  //     .insert([...regularRows, ...customBoxRows]);
  //
  //   if (error) throw new Error(error.message);
  // };
  // ───────────────────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) { showToast('Compila tutti i campi obbligatori', 'error'); return; }
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderNum = `SU${Date.now().toString().slice(-8)}`;
    const points = totalQuantity * 5;

    // Guadagna punti
    await addPoints(points);
    setEarnedPoints(points);

    // Incrementa uso coupon se presente
    if (coupon) await incrementCouponUsage(coupon.code);

    // Notifica push ordine
    sendOrderNotification(orderNum, '30-45');

    setOrderNumber(orderNum);
    setOrderComplete(true);
    setTimeout(() => resetCart(), 3000);
    setIsSubmitting(false);
  };

  if (totalQuantity === 0 && !orderComplete) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 text-center">
            <div className="card p-5">
              <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }}></i>
              <h3 className="mt-3">Carrello vuoto</h3>
              <p className="text-muted">Aggiungi prodotti prima di procedere al checkout</p>
              <Link to="/" className="btn btn-primary mt-3"><i className="bi bi-shop me-2"></i>Vai al Menu</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

              <div className="order-details bg-light rounded p-4 my-3">
                <p className="mb-2">
                  <strong>Numero Ordine:</strong><br />
                  <span className="h4 text-primary">{orderNumber}</span>
                </p>
                <p className="mb-0 text-muted">Conferma via email a {formData.email}</p>
              </div>

              {/* Punti guadagnati */}
              <div className="points-earned-banner mb-3">
                <i className="bi bi-star-fill me-1"></i>
                Hai guadagnato <strong>{earnedPoints} Sushi Points</strong>!
                {' '}Totale ordini: <strong>{totalOrders}</strong>
              </div>

              <div className="d-grid gap-2">
                <Link to="/" className="btn btn-primary btn-lg">
                  <i className="bi bi-shop me-2"></i>Torna al Menu
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
        <div className="col-12 col-lg-7 mb-4">
          <div className="card checkout-form-card">
            <div className="card-header bg-dark text-white">
              <h3 className="mb-0"><i className="bi bi-truck me-2"></i>Dati per la Consegna</h3>
            </div>
            <div className="card-body">
              {/* Notifiche push opt-in */}
              {permission === 'default' && (
                <div className="alert alert-info d-flex justify-content-between align-items-center py-2 mb-3">
                  <small><i className="bi bi-bell me-1"></i>Vuoi ricevere aggiornamenti sull'ordine?</small>
                  <button className="btn btn-sm btn-info" onClick={requestPermission}>Abilita notifiche</button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nome *</label>
                    <input type="text" className={`form-control ${errors.nome ? 'is-invalid' : ''}`} name="nome" value={formData.nome} onChange={handleChange} placeholder="Mario" />
                    {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Cognome *</label>
                    <input type="text" className={`form-control ${errors.cognome ? 'is-invalid' : ''}`} name="cognome" value={formData.cognome} onChange={handleChange} placeholder="Rossi" />
                    {errors.cognome && <div className="invalid-feedback">{errors.cognome}</div>}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} name="email" value={formData.email} onChange={handleChange} placeholder="mario.rossi@email.com" />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Telefono *</label>
                    <input type="tel" className={`form-control ${errors.telefono ? 'is-invalid' : ''}`} name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+39 333 1234567" />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Indirizzo *</label>
                  <input type="text" className={`form-control ${errors.indirizzo ? 'is-invalid' : ''}`} name="indirizzo" value={formData.indirizzo} onChange={handleChange} placeholder="Via Roma, 123" />
                  {errors.indirizzo && <div className="invalid-feedback">{errors.indirizzo}</div>}
                </div>
                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label className="form-label">Città *</label>
                    <input type="text" className={`form-control ${errors.citta ? 'is-invalid' : ''}`} name="citta" value={formData.citta} onChange={handleChange} placeholder="Milano" />
                    {errors.citta && <div className="invalid-feedback">{errors.citta}</div>}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">CAP *</label>
                    <input type="text" className={`form-control ${errors.cap ? 'is-invalid' : ''}`} name="cap" value={formData.cap} onChange={handleChange} placeholder="20100" maxLength="5" />
                    {errors.cap && <div className="invalid-feedback">{errors.cap}</div>}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label">Note aggiuntive</label>
                  <textarea className="form-control" name="note" value={formData.note} onChange={handleChange} rows="3" placeholder="Citofono, piano, allergie..."></textarea>
                </div>
                <div className="d-flex justify-content-between">
                  <Link to="/cart" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-1"></i>Torna al Carrello
                  </Link>
                  <button type="submit" className="btn btn-success btn-lg" disabled={isSubmitting}>
                    {isSubmitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Invio in corso...</> : <><i className="bi bi-check2-circle me-2"></i>Conferma Ordine</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card checkout-summary-card sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-secondary text-white">
              <h4 className="mb-0"><i className="bi bi-receipt me-2"></i>Riepilogo Ordine</h4>
            </div>
            <div className="card-body">
              <ul className="list-unstyled">
                {cartItems.map(item => (
                  <li key={item.id} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                    <span>{item.name} Roll <small className="text-muted ms-1">x{item.quantita}</small></span>
                    <span className="fw-bold">{(item.prezzo * item.quantita).toFixed(2)}€</span>
                  </li>
                ))}
              </ul>
              <hr />
              {discountPercent > 0 && (
                <div className="d-flex justify-content-between text-success mb-2">
                  <span><i className="bi bi-tag-fill me-1"></i>Sconto {discountPercent}%</span>
                  <span>-{discountAmount.toFixed(2)}€</span>
                </div>
              )}
              {coupon && couponDiscountAmount > 0 && (
                <div className="d-flex justify-content-between text-success mb-2">
                  <span><i className="bi bi-ticket-perforated-fill me-1"></i>Coupon {coupon.code}</span>
                  <span>-{couponDiscountAmount.toFixed(2)}€</span>
                </div>
              )}
              <div className="d-flex justify-content-between">
                <span className="h5">Totale:</span>
                <span className="h4 text-success fw-bold">{finalPrice.toFixed(2)}€</span>
              </div>
              <hr />
              <div className="text-muted small">
                <p className="mb-1"><i className="bi bi-clock me-1"></i>Consegna stimata: 30-45 minuti</p>
                <p className="mb-1"><i className="bi bi-credit-card me-1"></i>Pagamento alla consegna</p>
                <p className="mb-0 text-warning"><i className="bi bi-star-fill me-1"></i>Guadagnerai {totalQuantity * 5} Sushi Points!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
