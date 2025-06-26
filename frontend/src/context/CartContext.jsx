import React, { createContext, useContext, useReducer, useEffect } from 'react';

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;

      // --- FIX: Check for existing items based on the unique variant ID ---
      const existItem = state.cartItems.find(
        (item) => item.variant === newItem.variant
      );

      const cartItems = existItem
        ? state.cartItems.map((item) =>
            // If the variant already exists, just update it (e.g., with the new quantity)
            item.variant === existItem.variant ? newItem : item
          )
        : [...state.cartItems, newItem];
      
      return { ...state, cartItems };
    }
    case 'CART_REMOVE_ITEM': {
      // --- FIX: Remove item based on its unique variant ID ---
      const variantIdToRemove = action.payload;
      const cartItems = state.cartItems.filter(
        (item) => item.variant !== variantIdToRemove
      );
      return { ...state, cartItems };
    }
    // The rest of the cases remain the same
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

const getInitialState = () => {
  try {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      return JSON.parse(storedCart);
    }
  } catch (error) {
    console.error('Failed to parse cart from localStorage', error);
  }
  return {
    cartItems: [],
    shippingAddress: {},
    paymentMethod: 'UPI at Delivery',
  };
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  // --- FIX: The addToCart function now accepts a 'selectedVariant' object ---
  const addToCart = (product, qty, selectedVariant) => {
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: {
        product: product._id, // The base product ID
        name: product.name,
        image: product.images && product.images.length > 0 ? product.images[0] : '/images/sample.jpg',
        price: selectedVariant.price, // The price of the SPECIFIC variant
        variant: selectedVariant._id, // The UNIQUE ID of the variant itself
        ram: selectedVariant.ram,
        storage: selectedVariant.storage,
        countInStock: selectedVariant.countInStock,
        qty,
      },
    });
  };
  
  // --- FIX: removeFromCart now only needs the unique variantId ---
  const removeFromCart = (variantId) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: variantId });
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
    ...state, // Expose cartItems, shippingAddress, etc.
    addToCart,
    removeFromCart,
    saveShippingAddress,
    savePaymentMethod,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
