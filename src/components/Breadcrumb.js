import React from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Breadcrumb - Indicatore di navigazione
 * TODO #12: Mostra il percorso corrente nell'app
 */
const Breadcrumb = () => {
  const location = useLocation();

  // Mappa delle route con labels
  const routeLabels = {
    '/': 'Menu',
    '/cart': 'Carrello',
    '/checkout': 'Checkout'
  };

  // Determina i segmenti del breadcrumb
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [
      { path: '/', label: 'Home', icon: 'bi-house-door' }
    ];

    if (path !== '/') {
      // Aggiungi la pagina corrente
      const currentLabel = routeLabels[path] || 'Pagina';
      breadcrumbs.push({
        path: path,
        label: currentLabel,
        icon: path === '/cart' ? 'bi-cart3' : path === '/checkout' ? 'bi-truck' : 'bi-file'
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Non mostrare breadcrumb nella home
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb-container">
      <ol className="breadcrumb mb-0">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li
              key={crumb.path}
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
              aria-current={isLast ? 'page' : undefined}
            >
              {isLast ? (
                <span>
                  <i className={`bi ${crumb.icon} me-1`}></i>
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.path}>
                  <i className={`bi ${crumb.icon} me-1`}></i>
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
