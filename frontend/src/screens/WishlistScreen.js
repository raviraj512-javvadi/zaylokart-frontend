import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard.jsx';
import { Link } from 'react-router-dom';

const WishlistScreen = () => {
  const { wishlistItems } = useWishlist();

  return (
    <div className="featured-products-section">
      <h2 className="featured-title">My Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <div style={{textAlign: 'center'}}>
            Your wishlist is empty. <Link to="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="product-grid">
          {wishlistItems.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistScreen;