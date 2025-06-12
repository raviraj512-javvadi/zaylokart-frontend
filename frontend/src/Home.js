// frontend/src/pages/Home/Home.jsx
import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import { fetchProducts } from '../../data/productService';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="home-page">
      <h1>ZayloKart Products</h1>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
          />
        ))}
      </div>
    </div>
  );
};

export default Home;