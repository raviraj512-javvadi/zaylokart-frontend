import React from 'react';
import { Link } from 'react-router-dom';

const ProductBox = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-contain mb-3"
      />
      
      {/* ✅ Make title clickable */}
      <h3 className="text-lg font-semibold mb-1">
        <Link to={`/product/${product.id}`} className="hover:text-blue-600">
          {product.title}
        </Link>
      </h3>
      
      <p className="text-green-600 font-bold mb-1">{product.price}</p>
      <p className="text-sm text-gray-600">{product.description}</p>
    </div>
  );
};

export default ProductBox;
