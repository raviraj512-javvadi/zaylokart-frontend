import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../apiConfig';
import ProductCard from '../components/ProductCard';

// --- THIS IS THE FIX ---
// We are now importing the stylesheet that contains the styles for the Product Cards.
// This was the missing piece that prevented the grid from working.
import '../ProductGrid.css'; 
// Note: If your ProductGrid.css file is in a 'styles' folder,
// the path should be '../styles/ProductGrid.css'

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <div className="hero-section">
        <h1 className="hero-title">Style Redefined</h1>
        <p className="hero-subtitle">
          Discover curated collections that blend modern trends with timeless comfort. Unmissable deals await.
        </p>
        <Link to="/shop" className="hero-button">
          EXPLORE THE COLLECTION
        </Link>
      </div>

      <div className="featured-products-section">
        <h2 className="featured-title">Featured Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-grid">
            {/* Displaying only the first 4 products as featured */}
            {products.slice(0, 4).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomeScreen;
