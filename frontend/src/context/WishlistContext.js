import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import API_URL from '../apiConfig';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { userInfo } = useAuth();

  const fetchWishlist = useCallback(async () => {
    // Only fetch if the user is logged in and we have a token
    if (userInfo && userInfo.token) {
      try {
        const response = await fetch(`${API_URL}/api/users/wishlist`, {
          headers: {
            // --- THIS IS THE FIX: Re-add the Authorization header ---
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setWishlistItems(data);
        } else {
          // Don't log a 401 error as a hard error, it's expected if the token is expired
          if(response.status !== 401) console.error('Failed to fetch wishlist:', data.message);
        }
      } catch (error) {
        console.error('Network error fetching wishlist:', error);
      }
    } else {
      // If user logs out or is not logged in, clear the wishlist from the state
      setWishlistItems([]);
    }
  }, [userInfo]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const addToWishlist = async (product) => {
    // Double-check for userInfo and token before making the call
    if (!userInfo || !userInfo.token) {
        console.error("Cannot add to wishlist. User not logged in.");
        // Optionally, you could navigate to the login page here
        return;
    }
    try {
      const response = await fetch(`${API_URL}/api/users/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // --- THIS IS THE FIX: Re-add the Authorization header ---
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });
      const data = await response.json();
      if (response.ok) {
        setWishlistItems(data);
      } else {
        throw new Error(data.message || 'Server error');
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!userInfo || !userInfo.token) {
        console.error("Cannot remove from wishlist. User not logged in.");
        return;
    }
    try {
      const response = await fetch(`${API_URL}/api/users/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          // --- THIS IS THE FIX: Re-add the Authorization header ---
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setWishlistItems(data);
      } else {
        throw new Error(data.message || 'Server error');
      }
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
