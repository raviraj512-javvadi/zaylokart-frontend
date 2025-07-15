import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Import useParams
import API_URL from '../apiConfig';
import ProductCard from '../components/ProductCard';

// Import the stylesheet
import '../ProductGrid.css'; 

const HomeScreen = () => {
  // --- THIS IS THE FIX: Part 1 ---
  // Get the 'keyword' from the URL. For example, in /search/samsung, keyword will be "samsung".
  const { keyword } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- THIS IS THE FIX: Part 2 ---
  // The useEffect hook now depends on 'keyword'.
  // This means it will automatically run again every time the URL changes (i.e., a new search is performed).
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(''); // Reset error on new fetch
      try {
        // --- THIS IS THE FIX: Part 3 ---
        // Build the API URL dynamically. If there's a keyword, add it as a query parameter.
        // Your backend will use this to filter the products.
        const url = keyword 
          ? `${API_URL}/api/products?keyword=${keyword}`
          : `${API_URL}/api/products`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch products');
        }

        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword]); // The dependency array now includes 'keyword'

  // --- THIS IS THE FIX: Part 4 ---
  // Determine the title based on whether a search is active.
  const pageTitle = keyword ? `Search Results for "${keyword}"` : 'Featured Products';

  return (
    <>
      {/* The Hero section can be hidden on search results pages if you want */}
      {!keyword && (
        <div className="hero-section">
          <h1 className="hero-title">Style Redefined</h1>
          <p className="hero-subtitle">
            Discover curated collections that blend modern trends with timeless comfort. Unmissable deals await.
          </p>
          <Link to="/shop" className="hero-button">
            EXPLORE THE COLLECTION
          </Link>
        </div>
      )}

      <div className="featured-products-section">
        <h2 className="featured-title">{pageTitle}</h2>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading products...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>
        ) : products.length === 0 ? (
          // --- THIS IS THE FIX: Part 5 ---
          // Show a helpful message when no products are found for a search.
          <div style={{ textAlign: 'center' }}>
            <p>No products found.</p>
            <Link to="/" className="hero-button" style={{marginTop: '1rem'}}>Go Back Home</Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomeScreen;
