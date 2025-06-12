import React from 'react';
import ProductCard from './ProductCard';
import '../styles/ProductGrid.css';

const ProductGrid = ({ products }) => {
  return (
    <div className="product-grid-container">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;