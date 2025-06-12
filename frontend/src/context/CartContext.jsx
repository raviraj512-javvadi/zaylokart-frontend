import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const getInitialState = (key, defaultValue) => {
        try {
            const localData = localStorage.getItem(key);
            return localData ? JSON.parse(localData) : defaultValue;
        } catch (error) {
            return defaultValue;
        }
    };

    const [cartItems, setCartItems] = useState(() => getInitialState('cartItems', []));
    const [shippingAddress, setShippingAddress] = useState(() => getInitialState('shippingAddress', {}));
    const [paymentMethod, setPaymentMethod] = useState(() => getInitialState('paymentMethod', 'Razorpay'));

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    }, [shippingAddress]);

    useEffect(() => {
        localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
    }, [paymentMethod]);
    
    const addToCart = (product, qty, size) => {
        // --- THIS IS THE CORRECTED LINE ---
        const cartId = `${product._id}-${size}`;

        setCartItems(prevItems => {
            const exist = prevItems.find(item => item.cartId === cartId);
            if (exist) {
                return prevItems.map(item =>
                    item.cartId === cartId ? { ...item, qty: item.qty + qty } : item
                );
            } else {
                return [...prevItems, { ...product, qty: qty, size: size, cartId: cartId }];
            }
        });
    };

    const removeFromCart = (cartId) => {
        setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
    };

    const saveShippingAddress = (data) => {
        setShippingAddress(data);
    };

    const savePaymentMethod = (method) => {
        setPaymentMethod(method);
    };

    return (
        <CartContext.Provider value={{ cartItems, shippingAddress, paymentMethod, addToCart, removeFromCart, saveShippingAddress, savePaymentMethod }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};