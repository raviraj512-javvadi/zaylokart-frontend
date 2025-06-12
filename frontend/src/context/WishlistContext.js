import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { userInfo } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (userInfo) {
      try {
        const response = await fetch('/api/users/wishlist', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const data = await response.json();
        if (response.ok) setWishlistItems(data);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      }
    } else {
      // If user logs out, clear the wishlist
      setWishlistItems([]);
    }
  }, [userInfo]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    try {
      const response = await fetch('/api/users/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (response.ok) setWishlistItems(data);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`/api/users/wishlist/${productId}`, {
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