import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import API_URL from '../apiConfig';

const HomeScreen = () => {
  // --- UPDATE: Now gets both 'category' and 'keyword' from the URL ---
  const { category, keyword } = useParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- UPDATE: This now re-runs if the keyword OR the category changes ---
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      // --- UPDATE: Builds the correct API URL based on what's in the browser URL ---
      let url = '/api/products?';
      if (keyword) {
        url += `keyword=${keyword}`;
      } else if (category) {
        url += `category=${category}`;
      }
      
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setProducts(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, keyword]); // Dependency array now includes keyword

  // --- UPDATE: The page title is now aware of search results ---
  const pageTitle = keyword 
    ? `Search Results for: "${keyword}"`
    : category 
      ? category.replace(/-/g, ' ').toUpperCase() 
      : 'Featured Products';

  return (
    <>
      {/* UPDATE: Only show the big hero banner on the true homepage (no category or keyword) */}
      {!category && !keyword && (
        <section className="hero-section">
          <h1 className="hero-title">Style Redefined</h1>
          <p className="hero-subtitle">
            Discover curated collections that blend modern trends with timeless comfort. Unmissable deals await.
          </p>
          <Link to="/" className="hero-button">EXPLORE THE COLLECTION</Link>
        </section>
      )}

      <section className="featured-products-section">
        <h2 className="featured-title">{pageTitle}</h2>
        {loading && <div>Loading products...</div>}
        {error && <div>Error: {error}</div>}
        <div className="product-grid">
          {products.length > 0 ? (
             products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            !loading && <p>No products found.</p>
          )}
        </div>
      </section>
    </>
  );
};

export default HomeScreen;