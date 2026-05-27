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
  { id: 'small',  label: 'Piccola', maxPieces: 20, price: 25 },
  { id: 'medium', label: 'Media',   maxPieces: 50, price: 55 },
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
// Dipendenze da CartContext:
//   - showToast(message, type)  — feedback visivo (già presente nel Context)
//   - addPartyBox(payload)      — da aggiungere al CartContext (vedi commento ADD_TO_CART)
//
// State locale:
//   - selectedBoxId   'small' | 'medium' | null    — contenitore scelto
//   - portions        { [itemId]: portionCount }    — contatori porzioni

const PartyBoxConfigurator = () => {
  const { showToast, addPartyBox } = useCartContext();

  const [selectedBoxId, setSelectedBoxId] = useState(null);
  const [portions, setPortions]           = useState({});

  // ─── Selezione box ───────────────────────────────────────────────────────
  // Al cambio di box si azzerano le porzioni: evita stati inconsistenti
  // (es. 3 porzioni da 8pz in una box da 20pz).
  const handleSelectBox = useCallback((boxId) => {
    setSelectedBoxId(boxId);
    setPortions({});
  }, []);

  // ─── Handlers counter ────────────────────────────────────────────────────
  // useCallback con deps vuote: referenze stabili → React.memo su PieceCard è efficace.
  const handleIncrement = useCallback((itemId) => {
    setPortions(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  }, []);

  const handleDecrement = useCallback((itemId) => {
    setPortions(prev => {
      const current = prev[itemId] || 0;
      if (current <= 0) return prev;
      if (current === 1) {
        // Rimuove la chiave invece di lasciare { itemId: 0 } — stato pulito.
        const { [itemId]: _drop, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: current - 1 };
    });
  }, []);

  // ─── Stato derivato (useMemo) ────────────────────────────────────────────
  //
  // Un unico useMemo calcola tutto ciò che dipende da `portions` + `selectedBox`,
  // evitando calcoli ridondanti e creando un unico punto di verità per i valori derivati.

  const selectedBox = useMemo(
    () => BOX_OPTIONS.find(b => b.id === selectedBoxId) || null,
    [selectedBoxId]
  );

  const { currentTotalPieces, fillPercent, selections, canAddMap } = useMemo(() => {
    let currentTotalPieces = 0;
    const selections = [];

    ITEMS.forEach(item => {
      const count = portions[item.id] || 0;
      if (count > 0) {
        const totalPieces = count * item.piecesPerPortion;
        currentTotalPieces += totalPieces;
        selections.push({
          productId:        item.id,
          productName:      item.name,
          type:             item.type,
          portionCount:     count,
          piecesPerPortion: item.piecesPerPortion,
          totalPieces,
        });
      }
    });

    const maxPieces = selectedBox?.maxPieces ?? 0;
    const fillPercent = maxPieces > 0 ? Math.min((currentTotalPieces / maxPieces) * 100, 100) : 0;

    // Mappa booleana "questa card può ancora aggiungere una porzione?".
    // Passata come prop a ciascuna PieceCard: quando il totale cambia,
    // ogni card riceve un nuovo valore e React.memo decide se ri-renderizzare.
    const canAddMap = ITEMS.reduce((acc, item) => {
      acc[item.id] = !!selectedBox && (currentTotalPieces + item.piecesPerPortion <= maxPieces);
      return acc;
    }, {});

    return { currentTotalPieces, fillPercent, selections, canAddMap };
  }, [portions, selectedBox]);

  // La box è pronta quando è completamente piena (currentTotalPieces === maxBoxPieces).
  const isBoxFull  = !!selectedBox && currentTotalPieces === selectedBox.maxPieces;
  const isBoxEmpty = currentTotalPieces === 0;

  // Colore della progress bar in base al riempimento:
  // 0-49% → info, 50-84% → warning, 85-99% → danger, 100% → success
  const progressColor =
    fillPercent === 100   ? 'bg-success'
    : fillPercent >= 85   ? 'bg-danger'
    : fillPercent >= 50   ? 'bg-warning'
    : 'bg-info';

  // ─── Aggiunta al carrello ────────────────────────────────────────────────
  //
  // ADD_TO_CART: il payload è strutturato per il reducer del CartContext.
  // `addPartyBox` deve essere aggiunta al CartProvider con la seguente logica:
  //
  //   const addPartyBox = useCallback((payload) => {
  //     dispatchCustomBox({ type: 'ADD', payload });
  //   }, []);
  //
  // La funzione viene poi esposta nel `value` del CartContext.
  // Il `cartItemId` è generato QUI con crypto.randomUUID() perché è un
  // identificatore di "slot carrello", non un ID di business del prodotto.

  const handleAddToCart = useCallback(() => {
    if (!isBoxFull || !selectedBox) return;

    const payload = {
      cartItemId: crypto.randomUUID(),        // univoco per ogni box aggiunta
      boxType:    selectedBox.id,             // 'small' | 'medium'
      name:       `Box ${selectedBox.label} Personalizzata`,
      price:      selectedBox.price,          // prezzo fisso del contenitore
      maxPieces:  selectedBox.maxPieces,
      selections,                             // porzioni scelte (qty > 0)
    };

    // Chiama addPartyBox esposta dal CartContext
    addPartyBox(payload);

    // Reset UI — le selezioni tornano a zero, il tipo di box resta scelto
    setPortions({});
    showToast(`"${payload.name}" aggiunta al carrello! 🎉`, 'success');
  }, [isBoxFull, selectedBox, selections, addPartyBox, showToast]);

  // ─── Rendering ───────────────────────────────────────────────────────────

  return (
    <div className="card bg-dark text-white border-warning" aria-label="Configuratore Party Box">

      {/* ── Header ── */}
      <div className="card-header border-warning py-3">
        <div className="d-flex align-items-center gap-2 mb-1">
          <i className="bi bi-box-seam-fill text-warning fs-4" aria-hidden="true"></i>
          <h5 className="mb-0">Party Box Personalizzabile</h5>
        </div>
        <small className="text-muted">
          Scegli il contenitore, poi riempilo con le tue porzioni preferite.
        </small>
      </div>

      <div className="card-body">

        {/* ── Step 1: Scelta del contenitore ── */}
        <section aria-labelledby="box-step-label" className="mb-4">
          <p id="box-step-label" className="text-warning fw-semibold small mb-2">
            <span className="badge bg-warning text-dark me-2">1</span>
            Scegli il contenitore
          </p>
          <div className="d-flex gap-3 flex-wrap">
            {BOX_OPTIONS.map(box => (
              <button
                key={box.id}
                className={`btn flex-grow-1 py-3 border-2 fw-semibold transition-all
                  ${selectedBoxId === box.id
                    ? 'btn-warning text-dark'
                    : 'btn-outline-warning text-white'}`}
                onClick={() => handleSelectBox(box.id)}
                aria-pressed={selectedBoxId === box.id}
              >
                <div className="fs-5">
                  {box.id === 'small' ? '📦' : '🎁'} Box {box.label}
                </div>
                <div className="small fw-normal mt-1">
                  Max <strong>{box.maxPieces} pz</strong> · <strong>€{box.price}.00</strong>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Progress bar capienza ── */}
        {selectedBox && (
          <section aria-label="Capienza box" className="mb-4">
            <div className="d-flex justify-content-between align-items-baseline mb-1">
              <small className="text-muted">Capienza box</small>
              <small className={`fw-bold ${isBoxFull ? 'text-success' : 'text-warning'}`}
                aria-live="polite"
                aria-atomic="true"
              >
                {currentTotalPieces} / {selectedBox.maxPieces} pz
                {isBoxFull && (
                  <span className="ms-1">
                    <i className="bi bi-check-circle-fill text-success"></i> Piena!
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
            {/* Pezzi rimanenti */}
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
        )}

        {/* ── Step 2: Griglia prodotti ── */}
        <section aria-labelledby="items-step-label">
          <p id="items-step-label" className="text-warning fw-semibold small mb-3">
            <span className="badge bg-warning text-dark me-2">2</span>
            Scegli le porzioni
            {!selectedBox && (
              <span className="text-muted fw-normal ms-2">— seleziona prima un contenitore</span>
            )}
          </p>

          <div
            className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3"
            role="list"
            aria-label="Prodotti disponibili per il box"
          >
            {ITEMS.map(item => (
              <div key={item.id} className="col" role="listitem">
                <PieceCard
                  item={item}
                  portionCount={portions[item.id] || 0}
                  // canAdd è pre-calcolato nel parent: evita di ricomputare
                  // `currentTotalPieces + piecesPerPortion` dentro ogni card.
                  canAdd={canAddMap[item.id] ?? false}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                />
              </div>
            ))}
          </div>
        </section>

        {/* ── Riepilogo selezioni (visibile solo se ci sono porzioni) ── */}
        {!isBoxEmpty && (
          <div
            className={`mt-4 p-3 rounded border ${isBoxFull ? 'border-success bg-success bg-opacity-10' : 'border-warning bg-warning bg-opacity-10'}`}
            role="region"
            aria-label="Riepilogo selezioni"
            aria-live="polite"
          >
            <p className={`small fw-semibold mb-2 ${isBoxFull ? 'text-success' : 'text-warning'}`}>
              <i className="bi bi-receipt me-1" aria-hidden="true"></i>
              Composizione box
            </p>
            <ul className="list-unstyled mb-2">
              {selections.map(s => (
                <li key={s.productId} className="d-flex justify-content-between small text-white-50 mb-1">
                  <span>
                    {s.portionCount}× {s.productName}
                    <span className="text-muted ms-1">
                      ({s.portionCount} porz. · {s.totalPieces} pz)
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Footer / CTA ── */}
      <div className="card-footer border-warning py-3">
        {/* Mostra il prezzo del contenitore e i pezzi mancanti */}
        {selectedBox && !isBoxFull && (
          <p className="text-muted small text-center mb-2">
            {isBoxEmpty
              ? `Seleziona le porzioni per riempire la Box ${selectedBox.label} (${selectedBox.maxPieces} pz · €${selectedBox.price})`
              : `Mancano ancora ${selectedBox.maxPieces - currentTotalPieces} pz per completare la box.`}
          </p>
        )}

        <button
          className={`btn w-100 fw-semibold py-2 ${isBoxFull ? 'btn-success' : 'btn-outline-secondary'}`}
          onClick={handleAddToCart}
          disabled={!isBoxFull}
          aria-disabled={!isBoxFull}
        >
          {isBoxFull ? (
            <>
              <i className="bi bi-cart-plus me-2" aria-hidden="true"></i>
              Aggiungi Box al Carrello — €{selectedBox.price}.00
            </>
          ) : !selectedBox ? (
            'Scegli prima un contenitore'
          ) : (
            `Riempi la box (${currentTotalPieces}/${selectedBox.maxPieces} pz)`
          )}
        </button>
      </div>
    </div>
  );
};

export default PartyBoxConfigurator;
