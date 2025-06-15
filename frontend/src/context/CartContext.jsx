import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const getInitialState = (key, defaultValue) => { /* ... same as before ... */ };

  const [cartItems, setCartItems] = useState(() => getInitialState('cartItems', []));
  const [shippingAddress, setShippingAddress] = useState(() => getInitialState('shippingAddress', {}));
  const [paymentMethod, setPaymentMethod] = useState(() => getInitialState('paymentMethod', 'UPI at Delivery'));

  useEffect(() => { localStorage.setItem('cartItems', JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress)); }, [shippingAddress]);
  useEffect(() => { localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod)); }, [paymentMethod]);

  const savePaymentMethod = (data) => setPaymentMethod(data);

  const addToCart = (product, qty, size) => { /* ... your existing function ... */ };
  const removeFromCart = (cartId) => { /* ... your existing function ... */ };
  const saveShippingAddress = (data) => { setShippingAddress(data); };

  const clearCart = () => setCartItems([]); // <-- ADD a function to clear the cart after order

  return (
    <CartContext.Provider value={{ cartItems, shippingAddress, paymentMethod, addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);