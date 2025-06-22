import React, { createContext, useContext, useReducer, useEffect } from 'react';

// A more robust way to manage complex state like a cart
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cartItems.find(
        (item) => item.product === newItem.product && item.size === newItem.size
      );

      const cartItems = existItem
        ? state.cartItems.map((item) =>
            item.product === existItem.product && item.size === existItem.size ? newItem : item
          )
        : [...state.cartItems, newItem];
      
      return { ...state, cartItems };
    }
    case 'CART_REMOVE_ITEM': {
      const itemToRemove = action.payload;
      const cartItems = state.cartItems.filter(
        (item) => !(item.product === itemToRemove.product && item.size === itemToRemove.size)
      );
      return { ...state, cartItems };
    }
    case 'CART_SAVE_SHIPPING_ADDRESS':
      return { ...state, shippingAddress: action.payload };
    
    case 'CART_SAVE_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };

    case 'CART_CLEAR_ITEMS':
      return { ...state, cartItems: [] };

    default:
      return state;
  }
};

// --- Initial State ---
// We get the entire cart object from localStorage at once.
const getInitialState = () => {
  try {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      return JSON.parse(storedCart);
    }
  } catch (error) {
    console.error('Failed to parse cart from localStorage', error);
  }
  // Default state if nothing is in localStorage
  return {
    cartItems: [],
    shippingAddress: {},
    paymentMethod: 'UPI at Delivery',
  };
};


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  // This one effect now saves the entire cart state whenever it changes.
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product, qty, size) => {
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        product: product._id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        size: size,
        qty: qty,
      },
    });
  };
  
  const removeFromCart = (product, size) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: { product: product._id, size: size } });
  };
  
  const saveShippingAddress = (data) => {
    dispatch({ type: 'CART_SAVE_SHIPPING_ADDRESS', payload: data });
  };
  
  const savePaymentMethod = (data) => {
    dispatch({ type: 'CART_SAVE_PAYMENT_METHOD', payload: data });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CART_CLEAR_ITEMS' });
  };

  const value = {
    cartItems: state.cartItems,
    shippingAddress: state.shippingAddress,
    paymentMethod: state.paymentMethod,
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);