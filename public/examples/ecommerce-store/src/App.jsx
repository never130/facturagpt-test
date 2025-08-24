import React, { useState, useEffect } from 'react';
import ProductGrid from './components/ProductGrid';
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import { getProducts } from './utils/products';
import './styles/Store.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map(product => product.category))];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🛒</span>
            <h1>TechStore</h1>
          </div>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>
          
          <div className="header-actions">
            <div className="category-filter">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Todas las categorías' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              className="cart-btn"
              onClick={() => setShowCart(!showCart)}
            >
              🛒 Carrito ({getCartItemCount()})
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        {showCheckout ? (
          <Checkout
            cart={cart}
            total={getCartTotal()}
            onBack={() => setShowCheckout(false)}
            onComplete={() => {
              setCart([]);
              setShowCheckout(false);
              setShowCart(false);
              alert('¡Compra completada con éxito!');
            }}
          />
        ) : showCart ? (
          <ShoppingCart
            cart={cart}
            total={getCartTotal()}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={() => setShowCheckout(true)}
            onClose={() => setShowCart(false)}
          />
        ) : (
          <ProductGrid
            products={filteredProducts}
            onAddToCart={addToCart}
          />
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>TechStore</h3>
            <p>Tu tienda de tecnología de confianza</p>
          </div>
          <div className="footer-section">
            <h4>Enlaces</h4>
            <ul>
              <li><a href="#about">Sobre nosotros</a></li>
              <li><a href="#contact">Contacto</a></li>
              <li><a href="#help">Ayuda</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>📧 info@techstore.com</p>
            <p>📞 +1 234 567 890</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 TechStore. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 