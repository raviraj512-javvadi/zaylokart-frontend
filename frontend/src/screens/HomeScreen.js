import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import API_URL from '../apiConfig';

// ======================= THIS IS THE FINAL FIX =======================
// This line imports the CSS file and applies all the grid styles.
import '../ProductGrid.css'; 
// =====================================================================

const HomeScreen = () => {
  const { category, keyword } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      let url = '/api/products?';
      if (keyword) { url += `keyword=${keyword}`; } 
      else if (category) { url += `category=${category}`; }
      try {
        const response = await fetch(`${API_URL}${url}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Network response was not ok');
        }
        const data = await response.json();
        setProducts(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, keyword]);

  const pageTitle = keyword ? `Search Results for: "${keyword}"` : (category ? category.replace(/-/g, ' ').toUpperCase() : 'Featured Products');

  return (
    <>
      {!category && !keyword && (
        <section className="hero-section">
          <h1 className="hero-title">Style Redefined</h1>
          <p className="hero-subtitle">Discover curated collections that blend modern trends with timeless comfort. Unmissable deals await.</p>
          <a href="#featured" className="hero-button">EXPLORE THE COLLECTION</a>
        </section>
      )}
      <section id="featured" className="featured-products-section">
        <h2 className="featured-title">{pageTitle}</h2>
        {loading && <div>Loading products...</div>}
        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
        <div className="product-grid">
          {products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
          ) : (
            !loading && !error && <p>No products found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default HomeScreen;