import React, { useState } from 'react';

function Checkout({ cart, total, onBack, onComplete }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const getSubtotal = () => {
    return cart.reduce((subtotal, item) => subtotal + (item.price * item.quantity), 0);
  };

  const getShipping = () => {
    return getSubtotal() > 50 ? 0 : 5.99;
  };

  const getTax = () => {
    return getSubtotal() * 0.08;
  };

  const renderStep1 = () => (
    <div className="checkout-step">
      <h3>📋 Información de contacto</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Nombre *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Apellido *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="checkout-step">
      <h3>📍 Dirección de envío</h3>
      <div className="form-group">
        <label>Dirección *</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>Ciudad *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Estado *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Código Postal *</label>
        <input
          type="text"
          name="zipCode"
          value={formData.zipCode}
          onChange={handleInputChange}
          required
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="checkout-step">
      <h3>💳 Información de pago</h3>
      
      <div className="payment-methods">
        <label className="payment-option">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span className="payment-icon">💳</span>
          Tarjeta de crédito/débito
        </label>
        
        <label className="payment-option">
          <input
            type="radio"
            name="paymentMethod"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span className="payment-icon">📱</span>
          PayPal
        </label>
      </div>
      
      {paymentMethod === 'card' && (
        <>
          <div className="form-group">
            <label>Número de tarjeta *</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Nombre en la tarjeta *</label>
            <input
              type="text"
              name="cardName"
              value={formData.cardName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Fecha de vencimiento *</label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="form-group">
              <label>CVV *</label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                required
              />
            </div>
          </div>
        </>
      )}
      
      {paymentMethod === 'paypal' && (
        <div className="paypal-notice">
          <p>🔗 Serás redirigido a PayPal para completar el pago</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <button className="back-btn" onClick={onBack}>← Volver al carrito</button>
        <h2>💳 Checkout</h2>
        <div className="checkout-progress">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
        </div>
      </div>
      
      <div className="checkout-content">
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            
            <div className="checkout-actions">
              {currentStep > 1 && (
                <button 
                  type="button" 
                  className="prev-btn"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  ← Anterior
                </button>
              )}
              
              <button type="submit" className="next-btn">
                {currentStep === 3 ? 'Completar pedido' : 'Siguiente →'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="checkout-summary">
          <h3>Resumen del pedido</h3>
          
          <div className="order-items">
            {cart.map(item => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Cantidad: {item.quantity}</p>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
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
              <span>${(getSubtotal() + getShipping() + getTax()).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="security-badges">
            <div className="security-badge">🔒 Pago seguro</div>
            <div className="security-badge">📦 Envío garantizado</div>
            <div className="security-badge">💰 30 días de devolución</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout; 