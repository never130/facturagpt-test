
export const addToCart = (cart, product) => {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    return cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }
  
  return [...cart, { ...product, quantity: 1 }];
};

export const removeFromCart = (cart, productId) => {
  return cart.filter(item => item.id !== productId);
};

export const updateQuantity = (cart, productId, quantity) => {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }
  
  return cart.map(item =>
    item.id === productId ? { ...item, quantity } : item
  );
};

export const getCartTotal = (cart) => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartItemCount = (cart) => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};

export const getCartSubtotal = (cart) => {
  return cart.reduce((subtotal, item) => subtotal + (item.price * item.quantity), 0);
};

export const getShippingCost = (subtotal) => {
  return subtotal > 50 ? 0 : 5.99;
};

export const getTaxAmount = (subtotal) => {
  return subtotal * 0.08; 
};

export const getTotalWithTaxAndShipping = (cart) => {
  const subtotal = getCartSubtotal(cart);
  const shipping = getShippingCost(subtotal);
  const tax = getTaxAmount(subtotal);
  return subtotal + shipping + tax;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const saveCartToLocalStorage = (cart) => {
  try {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const loadCartFromLocalStorage = () => {
  try {
    const savedCart = localStorage.getItem('shoppingCart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

export const clearCart = () => {
  try {
    localStorage.removeItem('shoppingCart');
  } catch (error) {
    console.error('Error clearing cart from localStorage:', error);
  }
};

export const getCartSummary = (cart) => {
  const subtotal = getCartSubtotal(cart);
  const shipping = getShippingCost(subtotal);
  const tax = getTaxAmount(subtotal);
  const total = subtotal + shipping + tax;
  
  return {
    subtotal,
    shipping,
    tax,
    total,
    itemCount: getCartItemCount(cart),
    qualifiesForFreeShipping: subtotal >= 50,
    remainingForFreeShipping: Math.max(0, 50 - subtotal)
  };
};

export const validateCart = (cart) => {
  const errors = [];
  
  cart.forEach(item => {
    if (item.quantity > item.stock) {
      errors.push(`Stock insuficiente para ${item.name}. Disponible: ${item.stock}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}; 