import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">404 - Página no encontrada</h2>
      <p className="mt-2">Lo sentimos, la página que buscabas no existe.</p>
    </div>
  );
};

export default NotFoundPage;
