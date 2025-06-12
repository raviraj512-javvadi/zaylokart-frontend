import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext'; // <-- 1. ADD THIS IMPORT
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* 1. BrowserRouter for routing */}
    <BrowserRouter>
      {/* 2. AuthProvider for user login state */}
      <AuthProvider>
        {/* 3. CartProvider for shopping cart state */}
        <CartProvider>
          {/* 4. WishlistProvider for wishlist state */}
          <WishlistProvider> {/* <-- 2. ADD THIS WRAPPER */}
            <App />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);