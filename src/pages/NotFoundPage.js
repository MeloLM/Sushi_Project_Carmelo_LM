import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFoundPage - Pagina 404 per route inesistenti
 * TODO #1: Gestisce navigazione a URL non validi
 */
const NotFoundPage = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 text-center">
          <div className="card not-found-card p-5">
            {/* Emoji animato */}
            <div className="not-found-emoji">
              🍣
            </div>

            {/* Codice errore */}
            <h1 className="not-found-code">404</h1>

            {/* Messaggio */}
            <h2 className="mb-3">Oops! Pagina non trovata</h2>
            <p className="text-muted mb-4">
              Il sushi che cerchi non è nel nostro menu...
              <br />
              Ma abbiamo tante altre delizie!
            </p>

            {/* Azioni */}
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/" className="btn btn-primary btn-lg">
                <i className="bi bi-house-door me-2"></i>
                Torna al Menu
              </Link>
              <Link to="/cart" className="btn btn-outline-secondary btn-lg">
                <i className="bi bi-cart3 me-2"></i>
                Vai al Carrello
              </Link>
            </div>

            {/* Suggerimento */}
            <p className="mt-4 small text-muted">
              <i className="bi bi-lightbulb me-1"></i>
              Suggerimento: Controlla l'URL o usa i link sopra
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
