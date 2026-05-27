import React, { useState, useMemo, useCallback } from 'react';
import { useCartContext } from '../context';

// ─── Dati Mock ────────────────────────────────────────────────────────────────
//
// Array definito FUORI dal componente: referenza stabile, zero re-render causati
// dalla sua dichiarazione. Gli URL sono costruiti dalla CDN di Unsplash estraendo
// il photo-ID dal link di pagina fornito; il componente gestisce il fallback con
// onError in caso di mancato caricamento.

const ITEMS = [
  {
    id:              'roll_1',
    name:            'California Roll',
    type:            'uramaki',
    piecesPerPortion: 8,
    // Unsplash page: .../a-close-up-of-sushi-...-xaiiRqomAmo
    image: 'https://images.unsplash.com/photo-xaiiRqomAmo?fit=crop&w=400&h=280&q=80',
  },
  {
    id:              'roll_2',
    name:            'Rainbow Roll',
    type:            'uramaki',
    piecesPerPortion: 8,
    // Unsplash page: .../a-variety-of-sushi-rolls-...-Avi5cKHSLw8
    image: 'https://images.unsplash.com/photo-Avi5cKHSLw8?fit=crop&w=400&h=280&q=80',
  },
  {
    id:              'nigiri_1',
    name:            'Sake Nigiri (Salmone)',
    type:            'nigiri',
    piecesPerPortion: 2,
    // Unsplash page: .../salmon-nigiri-sushi-...-_LZdzLrx-E0
    image: 'https://images.unsplash.com/photo-_LZdzLrx-E0?fit=crop&w=400&h=280&q=80',
  },
  {
    id:              'nigiri_2',
    name:            'Maguro Nigiri (Tonno)',
    type:            'nigiri',
    piecesPerPortion: 2,
    // Unsplash page: .../tuna-nigiri-sushi-...-0GLzjcRBJQ8
    image: 'https://images.unsplash.com/photo-0GLzjcRBJQ8?fit=crop&w=400&h=280&q=80',
  },
];

// Contenitori disponibili — prezzi e capienza massima sono dati di business fissi.
const BOX_OPTIONS = [
  {
    id: 'small', label: 'Piccola', maxPieces: 20, price: 25, emoji: '📦',
    tagline: 'Perfetta per 1-2 persone',
    features: ['20 pezzi totali', 'Ideale per aperitivo', 'Consegna rapida'],
  },
  {
    id: 'medium', label: 'Media', maxPieces: 50, price: 55, emoji: '🎁',
    tagline: 'La scelta più popolare',
    features: ['50 pezzi totali', 'Per 3-4 persone', 'Mix uramaki + nigiri'],
    recommended: true,
  },
  {
    id: 'large', label: 'Grande', maxPieces: 80, price: 85, emoji: '🎊',
    tagline: 'Per feste e occasioni speciali',
    features: ['80 pezzi totali', 'Per 5+ persone', 'Massima libertà di scelta'],
  },
];

// SVG placeholder inline codificato come data-URI: nessun asset aggiuntivo,
// nessun round-trip di rete in caso di errore immagine.
const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='280' " +
  "viewBox='0 0 400 280'%3E%3Crect width='400' height='280' fill='%23212529'/%3E" +
  "%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' " +
  "font-size='60' fill='%23ffc107'%3E%F0%9F%8D%B1%3C/text%3E%3C/svg%3E";

// ─── Sotto-componente PieceCard ───────────────────────────────────────────────
//
// React.memo: la card ri-renderizza SOLO se cambia il suo portionCount o canAdd.
// onIncrement/onDecrement sono stabilizzati con useCallback nel parent, quindi
// il confronto shallow di React.memo è efficace e non genera render inutili
// quando l'utente clicca + su un'altra card.

const PieceCard = React.memo(({ item, portionCount, canAdd, onIncrement, onDecrement }) => {
  // Idempotente: dopo il primo errore target.src punta al fallback e non si ripete.
  const handleImgError = useCallback((e) => {
    if (e.target.src !== FALLBACK_IMG) e.target.src = FALLBACK_IMG;
  }, []);

  const hasPortions = portionCount > 0;
  const totalPiecesThisItem = portionCount * item.piecesPerPortion;

  return (
    <div
      className={`card h-100 border-2 bg-dark text-white
        ${hasPortions ? 'border-warning' : 'border-secondary'}`}
    >
      {/* ── Immagine con badge porzioni ── */}
      <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
        <img
          src={item.image}
          alt={item.name}
          onError={handleImgError}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Badge tipologia pezzo */}
        <span className="position-absolute top-0 start-0 badge bg-dark bg-opacity-75 text-warning m-2 text-capitalize">
          {item.type}
        </span>
        {/* Badge porzioni selezionate — visibile solo se > 0 */}
        {hasPortions && (
          <span
            className="position-absolute top-0 end-0 badge bg-warning text-dark m-2 fs-6"
            aria-label={`${portionCount} porzioni selezionate`}
          >
            ×{portionCount}
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column p-3">
        <h6 className="card-title text-white mb-0 lh-sm">{item.name}</h6>

        {/* Info porzione: quanti pezzi conta UNA porzione */}
        <small className="text-muted mb-1">
          1 porzione = <strong className="text-warning">{item.piecesPerPortion} pz</strong>
        </small>

        {/* Totale pezzi per questo item — mostrato solo se selezionato */}
        <small className={`mb-3 fw-semibold ${hasPortions ? 'text-warning' : 'text-transparent'}`}
          aria-live="polite"
          style={{ visibility: hasPortions ? 'visible' : 'hidden' }}
        >
          Totale: {totalPiecesThisItem} pz nel box
        </small>

        {/* ── Counter porzioni +/- ── */}
        <div
          className="d-flex align-items-center justify-content-between mt-auto"
          role="group"
          aria-label={`Porzioni di ${item.name}`}
        >
          <button
            className="btn btn-outline-danger btn-sm px-3"
            onClick={() => onDecrement(item.id)}
            disabled={portionCount <= 0}
            aria-label={`Rimuovi una porzione di ${item.name}`}
          >
            <i className="bi bi-dash-lg" aria-hidden="true"></i>
          </button>

          <span
            className={`fw-bold fs-5 ${hasPortions ? 'text-warning' : 'text-muted'}`}
            aria-live="polite"
            aria-atomic="true"
            aria-label={`${portionCount} porzioni di ${item.name}`}
          >
            {portionCount}
          </span>

          {/*
            Il pulsante "+" è disabilitato se aggiungere UNA porzione farebbe
            sforare la capienza massima del box:
            currentTotalPieces + item.piecesPerPortion > maxBoxPieces
            Questo calcolo è già stato fatto nel parent (canAdd) per evitare
            di ricomputarlo dentro ogni card.
          */}
          <button
            className="btn btn-outline-warning btn-sm px-3"
            onClick={() => onIncrement(item.id)}
            disabled={!canAdd}
            aria-label={
              canAdd
                ? `Aggiungi una porzione di ${item.name}`
                : `Impossibile aggiungere: il box è pieno`
            }
          >
            <i className="bi bi-plus-lg" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
});

PieceCard.displayName = 'PieceCard';

// ─── Componente Principale ────────────────────────────────────────────────────
//
// Flusso a due step gestito tramite stato locale `step` (1 | 2):
//   Step 1 — Selezione taglia: 3 pricing card Bootstrap affiancate
//   Step 2 — Composizione:     griglia PieceCard con progress bar e riepilogo
//
// Dipendenze da CartContext:
//   - showToast(message, type)  — già presente nel Context
//   - addPartyBox(payload)      — da aggiungere al CartProvider

const PartyBoxConfigurator = () => {
  const { showToast, addPartyBox } = useCartContext();

  // step: 1 = selezione taglia | 2 = composizione
  const [step, setStep]               = useState(1);
  const [selectedBox, setSelectedBox] = useState(null);   // oggetto BOX_OPTIONS
  const [portions, setPortions]       = useState({});     // { [itemId]: portionCount }

  // ─── Navigazione tra gli step ────────────────────────────────────────────

  // Step 1 → 2: salva la box scelta e azzera le porzioni
  const handleSelectBox = useCallback((box) => {
    setSelectedBox(box);
    setPortions({});
    setStep(2);
  }, []);

  // Step 2 → 1: torna indietro e resetta tutto
  const handleBack = useCallback(() => {
    setStep(1);
    setSelectedBox(null);
    setPortions({});
  }, []);

  // ─── Handlers counter porzioni ───────────────────────────────────────────

  const handleIncrement = useCallback((itemId) => {
    setPortions(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  }, []);

  const handleDecrement = useCallback((itemId) => {
    setPortions(prev => {
      const current = prev[itemId] || 0;
      if (current <= 0) return prev;
      if (current === 1) {
        const { [itemId]: _drop, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: current - 1 };
    });
  }, []);

  // ─── Stato derivato ───────────────────────────────────────────────────────

  const { currentTotalPieces, fillPercent, selections, canAddMap } = useMemo(() => {
    let currentTotalPieces = 0;
    const selections = [];

    ITEMS.forEach(item => {
      const count = portions[item.id] || 0;
      if (count > 0) {
        const totalPieces = count * item.piecesPerPortion;
        currentTotalPieces += totalPieces;
        selections.push({
          productId: item.id, productName: item.name, type: item.type,
          portionCount: count, piecesPerPortion: item.piecesPerPortion, totalPieces,
        });
      }
    });

    const maxPieces   = selectedBox?.maxPieces ?? 0;
    const fillPercent = maxPieces > 0 ? Math.min((currentTotalPieces / maxPieces) * 100, 100) : 0;

    const canAddMap = ITEMS.reduce((acc, item) => {
      acc[item.id] = !!selectedBox && (currentTotalPieces + item.piecesPerPortion <= maxPieces);
      return acc;
    }, {});

    return { currentTotalPieces, fillPercent, selections, canAddMap };
  }, [portions, selectedBox]);

  const isBoxFull  = !!selectedBox && currentTotalPieces === selectedBox.maxPieces;
  const isBoxEmpty = currentTotalPieces === 0;

  const progressColor =
    fillPercent === 100 ? 'bg-success'
    : fillPercent >= 85 ? 'bg-danger'
    : fillPercent >= 50 ? 'bg-warning'
    : 'bg-info';

  // ─── Aggiunta al carrello ────────────────────────────────────────────────

  const handleAddToCart = useCallback(() => {
    if (!isBoxFull || !selectedBox) return;

    const payload = {
      cartItemId: crypto.randomUUID(),
      boxType:    selectedBox.id,
      name:       `Box ${selectedBox.label} Personalizzata`,
      price:      selectedBox.price,
      maxPieces:  selectedBox.maxPieces,
      selections,
    };

    addPartyBox(payload);
    setPortions({});
    setStep(1);
    setSelectedBox(null);
    showToast(`"${payload.name}" aggiunta al carrello! 🎉`, 'success');
  }, [isBoxFull, selectedBox, selections, addPartyBox, showToast]);

  // ─── Rendering ───────────────────────────────────────────────────────────

  return (
    <div className="card bg-dark text-white border-warning" aria-label="Party Box Configurator">

      {/* ── Header comune ai due step ── */}
      <div className="card-header border-warning py-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-box-seam-fill text-warning fs-4" aria-hidden="true"></i>
            <div>
              <h5 className="mb-0">Party Box Personalizzabile</h5>
              <small className="text-muted">
                {step === 1
                  ? 'Scegli la taglia del tuo box'
                  : `Box ${selectedBox.label} · ${selectedBox.maxPieces} pz · €${selectedBox.price}`}
              </small>
            </div>
          </div>

          {/* Breadcrumb step — visuale */}
          <div className="d-flex align-items-center gap-1" aria-label="Progresso configurazione">
            <span className={`badge rounded-pill ${step >= 1 ? 'bg-warning text-dark' : 'bg-secondary'}`}>
              1 Taglia
            </span>
            <i className="bi bi-chevron-right text-muted small" aria-hidden="true"></i>
            <span className={`badge rounded-pill ${step === 2 ? 'bg-warning text-dark' : 'bg-secondary'}`}>
              2 Porzioni
            </span>
          </div>
        </div>
      </div>

      <div className="card-body">

        {/* ════════════════════════════════════════════════════════════════
            STEP 1 — Selezione della taglia (Pricing Cards Bootstrap 5)
            ════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="row row-cols-1 row-cols-md-3 g-4" role="list" aria-label="Opzioni box">
            {BOX_OPTIONS.map(box => (
              <div key={box.id} className="col" role="listitem">
                <div
                  className={`card h-100 bg-dark border-2 text-white position-relative
                    ${box.recommended ? 'border-warning' : 'border-secondary'}`}
                >
                  {/* Badge "Più scelto" */}
                  {box.recommended && (
                    <span
                      className="position-absolute top-0 start-50 translate-middle badge bg-warning text-dark px-3"
                      style={{ fontSize: '0.75rem' }}
                    >
                      ⭐ Più scelto
                    </span>
                  )}

                  <div className={`card-header text-center border-0 pt-4 pb-2 ${box.recommended ? 'bg-warning bg-opacity-10' : ''}`}>
                    <div style={{ fontSize: '2.5rem' }} aria-hidden="true">{box.emoji}</div>
                    <h4 className="fw-bold text-white mt-1">Box {box.label}</h4>
                    <p className="text-muted small mb-0">{box.tagline}</p>
                  </div>

                  <div className="card-body text-center">
                    {/* Prezzo */}
                    <div className="mb-3">
                      <span className="display-5 fw-bold text-warning">€{box.price}</span>
                      <span className="text-muted small d-block">prezzo fisso</span>
                    </div>

                    {/* Feature list */}
                    <ul className="list-unstyled text-start mb-0">
                      {box.features.map((f, i) => (
                        <li key={i} className="mb-2 d-flex align-items-center gap-2">
                          <i className="bi bi-check-circle-fill text-warning flex-shrink-0" aria-hidden="true"></i>
                          <span className="small">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card-footer border-0 pb-4 bg-transparent text-center">
                    <button
                      className={`btn w-100 fw-semibold ${box.recommended ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => handleSelectBox(box)}
                      aria-label={`Scegli Box ${box.label}: ${box.maxPieces} pezzi a €${box.price}`}
                    >
                      Scegli questa Box
                      <i className="bi bi-arrow-right ms-2" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            STEP 2 — Composizione delle porzioni
            ════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <>
            {/* ── Progress bar capienza ── */}
            <section aria-label="Capienza box" className="mb-4">
              <div className="d-flex justify-content-between align-items-baseline mb-1">
                <small className="text-muted">Capienza utilizzata</small>
                <small
                  className={`fw-bold ${isBoxFull ? 'text-success' : 'text-warning'}`}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {currentTotalPieces} / {selectedBox.maxPieces} pz
                  {isBoxFull && (
                    <span className="ms-1">
                      <i className="bi bi-check-circle-fill"></i> Box piena!
                    </span>
                  )}
                </small>
              </div>
              <div
                className="progress bg-secondary"
                style={{ height: 12, borderRadius: 6 }}
                role="progressbar"
                aria-valuenow={currentTotalPieces}
                aria-valuemin={0}
                aria-valuemax={selectedBox.maxPieces}
                aria-label={`Box riempita al ${Math.round(fillPercent)}%`}
              >
                <div
                  className={`progress-bar ${progressColor} ${fillPercent < 100 ? 'progress-bar-striped progress-bar-animated' : ''}`}
                  style={{ width: `${fillPercent}%`, transition: 'width 0.3s ease' }}
                />
              </div>
              {!isBoxEmpty && !isBoxFull && (
                <small className="text-muted mt-1 d-block">
                  Ancora{' '}
                  <strong className="text-warning">
                    {selectedBox.maxPieces - currentTotalPieces} pz
                  </strong>{' '}
                  per completare la box.
                </small>
              )}
            </section>

            {/* ── Griglia PieceCard ── */}
            <section aria-label="Scegli le porzioni" className="mb-4">
              <div
                className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3"
                role="list"
                aria-label="Prodotti disponibili"
              >
                {ITEMS.map(item => (
                  <div key={item.id} className="col" role="listitem">
                    <PieceCard
                      item={item}
                      portionCount={portions[item.id] || 0}
                      canAdd={canAddMap[item.id] ?? false}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* ── Riepilogo composizione ── */}
            {!isBoxEmpty && (
              <div
                className={`p-3 rounded border ${isBoxFull ? 'border-success bg-success bg-opacity-10' : 'border-warning bg-warning bg-opacity-10'}`}
                role="region"
                aria-label="Riepilogo selezioni"
                aria-live="polite"
              >
                <p className={`small fw-semibold mb-2 ${isBoxFull ? 'text-success' : 'text-warning'}`}>
                  <i className="bi bi-receipt me-1" aria-hidden="true"></i>
                  Composizione box
                </p>
                <ul className="list-unstyled mb-0">
                  {selections.map(s => (
                    <li key={s.productId} className="d-flex justify-content-between small text-white-50 mb-1">
                      <span>{s.portionCount}× {s.productName}</span>
                      <span className="text-muted">{s.totalPieces} pz</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Footer / CTA ── */}
      <div className="card-footer border-warning py-3">
        {step === 1 ? (
          <p className="text-muted small text-center mb-0">
            <i className="bi bi-info-circle me-1"></i>
            Seleziona una taglia per iniziare a comporre il tuo box.
          </p>
        ) : (
          <div className="d-flex gap-2">
            {/* Bottone Indietro */}
            <button
              className="btn btn-outline-secondary"
              onClick={handleBack}
              aria-label="Torna alla selezione della taglia"
            >
              <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>
              Indietro
            </button>

            {/* CTA Aggiungi al carrello — attivo SOLO quando box è esattamente piena */}
            <button
              className={`btn fw-semibold flex-grow-1 ${isBoxFull ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={handleAddToCart}
              disabled={!isBoxFull}
              aria-disabled={!isBoxFull}
            >
              {isBoxFull ? (
                <>
                  <i className="bi bi-cart-plus me-2" aria-hidden="true"></i>
                  Aggiungi Box al Carrello — €{selectedBox.price}.00
                </>
              ) : (
                `Riempi la box (${currentTotalPieces}/${selectedBox.maxPieces} pz)`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartyBoxConfigurator;
