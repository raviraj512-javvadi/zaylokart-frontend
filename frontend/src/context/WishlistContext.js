import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import API_URL from '../apiConfig';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { userInfo } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (userInfo) {
      try {
        const response = await fetch(`${API_URL}/api/users/wishlist`, {
          // --- THIS IS THE FIX ---
          credentials: 'include',
          // ----------------------
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

  const addToWishlist = async (product) => {
    try {
      const response = await fetch(`${API_URL}/api/users/wishlist`, {
        method: 'POST',
        // --- THIS IS THE FIX ---
        credentials: 'include',
        // ----------------------
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await response.json();
      if (response.ok) setWishlistItems(data);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/api/users/wishlist/${productId}`, {
        method: 'DELETE',
        // --- THIS IS THE FIX ---
        credentials: 'include',
        // ----------------------
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
