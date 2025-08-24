import React from 'react';
import ProductCard from './ProductCard';

function ProductGrid({ products, onAddToCart }) {
  if (products.length === 0) {
    return (
      <div className="no-products">
        <div className="no-products-icon">🔍</div>
        <h2>No se encontraron productos</h2>
        <p>Intenta ajustar tus filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <div className="product-grid-header">
        <h2>Productos ({products.length})</h2>
        <div className="grid-controls">
          <button className="grid-view-btn active">📱</button>
          <button className="list-view-btn">📋</button>
        </div>
      </div>
      
      <div className="product-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
      
      <div className="product-grid-footer">
        <p>Mostrando {products.length} productos</p>
        <div className="pagination">
          <button className="pagination-btn" disabled>← Anterior</button>
          <span className="pagination-info">Página 1 de 1</span>
          <button className="pagination-btn" disabled>Siguiente →</button>
        </div>
      </div>
    </div>
  );
}

export default ProductGrid; 