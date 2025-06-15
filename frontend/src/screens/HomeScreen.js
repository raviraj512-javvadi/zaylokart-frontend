import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import API_URL from '../apiConfig';

const HomeScreen = () => {
  const { category, keyword } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let url = '/api/products?';
      if (keyword) {
        url += `keyword=${keyword}`;
      } else if (category) {
        url += `category=${category}`;
      }

      try {
        const response = await fetch(`${API_URL}${url}`);
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
  }, [category, keyword]);

  const pageTitle = keyword
    ? `Search Results for: "${keyword}"`
    : category
      ? category.replace(/-/g, ' ').toUpperCase()
      : 'Featured Products';

  return (
    <>
      {!category && !keyword && (
        <section className="hero-section">
          <div className="hero-container">
            <h1 className="hero-title">Style Redefined</h1>
            <p className="hero-subtitle">
              Discover curated collections that blend modern trends with timeless comfort. Unmissable deals await.
            </p>
            <Link to="/" className="hero-button">EXPLORE THE COLLECTION</Link>
          </div>
        </section>
      )}

      <section className="featured-products-section">
        <div className="main-content">
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
        </div>
      </section>
    </>
  );
};

export default HomeScreen;
