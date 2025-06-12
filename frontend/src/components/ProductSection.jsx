import React from 'react';

const ProductSection = ({ title, products }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded-lg text-center">
            <img src={product.image} alt={product.title} className="h-48 w-full object-contain mb-2" />
            <h3 className="font-semibold">{product.title}</h3>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;