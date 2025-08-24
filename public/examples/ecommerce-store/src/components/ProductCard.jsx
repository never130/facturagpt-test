import React, { useState } from 'react';

function ProductCard({ product, onAddToCart }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>
          {i <= rating ? '⭐' : '☆'}
        </span>
      );
    }
    return stars;
  };

  return (
    <div 
      className={`product-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setShowDetails(!showDetails)}
    >
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <div className="product-overlay">
          <button className="quick-view-btn">👁️ Vista rápida</button>
        </div>
        {product.discount && (
          <div className="discount-badge">
            -{product.discount}%
          </div>
        )}
        {product.isNew && (
          <div className="new-badge">
            Nuevo
          </div>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-rating">
          <div className="stars">
            {getRatingStars(product.rating)}
          </div>
          <span className="rating-count">({product.reviewCount})</span>
        </div>
        
        <div className="product-price">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="original-price">${product.originalPrice}</span>
          )}
          <span className="current-price">${product.price}</span>
        </div>
        
        <div className="product-actions">
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            🛒 Agregar al carrito
          </button>
          <button className="wishlist-btn">❤️</button>
        </div>
        
        {product.stock < 10 && product.stock > 0 && (
          <div className="low-stock-warning">
            ¡Solo quedan {product.stock} unidades!
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="out-of-stock">
            Agotado
          </div>
        )}
      </div>
      
      {showDetails && (
        <div className="product-details">
          <div className="details-content">
            <h4>Especificaciones</h4>
            <ul>
              {product.specifications?.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))}
            </ul>
            
            <h4>Características</h4>
            <ul>
              {product.features?.map((feature, index) => (
                <li key={index}>✓ {feature}</li>
              ))}
            </ul>
            
            <div className="shipping-info">
              <p>🚚 Envío gratis en pedidos superiores a $50</p>
              <p>⏰ Entrega en 2-3 días hábiles</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCard; 