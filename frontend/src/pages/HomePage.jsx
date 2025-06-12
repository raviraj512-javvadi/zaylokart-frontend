import React from 'react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';

const HomePage = ({ products }) => {
  return (
    <>
      <Hero />
      <ProductGrid products={products} />
    </>
  );
};

export default HomePage;