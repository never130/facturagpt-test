import React from 'react';

function ShoppingCart({ cart, total, onUpdateQuantity, onRemoveItem, onCheckout, onClose }) {
  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h2>🛒 Carrito de Compras</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega algunos productos para comenzar</p>
          <button className="continue-shopping-btn" onClick={onClose}>
            Continuar comprando
          </button>
        </div>
      </div>
    );
  }

  const getSubtotal = () => {
    return cart.reduce((subtotal, item) => subtotal + (item.price * item.quantity), 0);
  };

  const getShipping = () => {
    return getSubtotal() > 50 ? 0 : 5.99;
  };

  const getTax = () => {
    return getSubtotal() * 0.08; 
  };

  const getTotal = () => {
    return getSubtotal() + getShipping() + getTax();
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>🛒 Carrito de Compras ({cart.length} items)</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      
      <div className="cart-content">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="item-details">
                <h4 className="item-name">{item.name}</h4>
                <p className="item-category">{item.category}</p>
                <div className="item-price">${item.price}</div>
              </div>
              
              <div className="item-quantity">
                <button 
                  className="quantity-btn"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <div className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              
              <button 
                className="remove-item-btn"
                onClick={() => onRemoveItem(item.id)}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h3>Resumen del pedido</h3>
          
          <div className="summary-row">
            <span>Subtotal ({cart.length} items):</span>
            <span>${getSubtotal().toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Envío:</span>
            <span>{getShipping() === 0 ? 'Gratis' : `$${getShipping().toFixed(2)}`}</span>
          </div>
          
          <div className="summary-row">
            <span>Impuestos:</span>
            <span>${getTax().toFixed(2)}</span>
          </div>
          
          <div className="summary-row total">
            <span>Total:</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>
          
          {getShipping() > 0 && (
            <div className="free-shipping-notice">
              💡 Agrega ${(50 - getSubtotal()).toFixed(2)} más para envío gratis
            </div>
          )}
          
          <div className="cart-actions">
            <button className="continue-shopping-btn" onClick={onClose}>
              ← Continuar comprando
            </button>
            <button className="checkout-btn" onClick={onCheckout}>
              Proceder al pago →
            </button>
          </div>
          
          <div className="payment-methods">
            <p>Aceptamos:</p>
            <div className="payment-icons">
              <span>💳</span>
              <span>🏦</span>
              <span>📱</span>
              <span>💻</span>
            </div>
          </div>
          
          <div className="security-notice">
            <p>🔒 Pago seguro con encriptación SSL</p>
            <p>📦 Envío garantizado en 2-3 días hábiles</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart; 