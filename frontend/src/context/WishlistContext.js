import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import API_URL from '../apiConfig'; // <-- 1. IMPORT THE API_URL

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { userInfo } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (userInfo) {
      try {
        // --- 2. USE THE FULL API_URL ---
        const response = await fetch(`${API_URL}/api/users/wishlist`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await response.json();
        if (response.ok) setWishlistItems(data);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      }
    } else {
      setWishlistItems([]);
    }
  }, [userInfo]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product) => { // Now accepts the full product object
    try {
      const response = await fetch(`${API_URL}/api/users/wishlist`, { // <-- Use API_URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ productId: product._id }), // Send the ID
      });
      const data = await response.json();
      if (response.ok) setWishlistItems(data);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/api/users/wishlist/${productId}`, { // <-- Use API_URL
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      const data = await response.json();
      if (response.ok) setWishlistItems(data);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const value = { wishlistItems, addToWishlist, removeFromWishlist };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};
