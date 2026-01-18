import React from 'react';
import PropTypes from 'prop-types';
import usePWA from '../hooks/usePWA';

/**
 * Componente per indicatori PWA
 * - Stato offline/online
 * - Prompt installazione app
 */
const PWAPrompt = () => {
  const { 
    isOnline, 
    isInstallable, 
    installApp, 
    dismissInstallPrompt 
  } = usePWA();

  // Non mostrare se già dismissed
  const isDismissed = localStorage.getItem('pwa-install-dismissed') === 'true';

  return (
    <>
      {/* Indicatore Offline */}
      {!isOnline && (
        <div className="offline-indicator">
          <i className="bi bi-wifi-off me-2"></i>
          Sei offline
        </div>
      )}

      {/* Prompt Installazione */}
      {isInstallable && !isDismissed && (
        <div className="install-prompt">
          <div>
            <strong>Installa Sushi Project</strong>
            <br />
            <small>Accedi rapidamente dal tuo dispositivo</small>
          </div>
          <button 
            className="btn btn-success btn-sm"
            onClick={installApp}
          >
            <i className="bi bi-download me-1"></i>
            Installa
          </button>
          <button 
            className="btn btn-outline-light btn-sm"
            onClick={dismissInstallPrompt}
            aria-label="Chiudi prompt installazione"
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}
    </>
  );
};

PWAPrompt.propTypes = {};

export default PWAPrompt;
