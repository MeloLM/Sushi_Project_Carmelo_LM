import React, { useEffect } from 'react';
import { Breadcrumb } from '../components';
import { PartyBoxConfigurator } from '../components';

const BoxBuilderPage = () => {
  useEffect(() => {
    document.title = 'Box Builder - ZenSushi';
  }, []);

  return (
    <div className="container min-vh-100 py-4">
      <Breadcrumb
        items={[
          { label: 'Menu', path: '/' },
          { label: 'Box Builder' },
        ]}
      />

      <div className="mb-4">
        <h1 className="fw-bold text-white">
          <span className="text-warning">Party Box</span> Personalizzabile 🎊
        </h1>
        <p className="text-muted">
          Scegli la taglia del box, poi componi il tuo assortimento di sushi scegliendo
          le porzioni preferite — il prezzo è fisso in base alla taglia.
        </p>
      </div>

      <PartyBoxConfigurator />
    </div>
  );
};

export default BoxBuilderPage;
