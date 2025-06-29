import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating'; // Assuming you have a Rating component for stars

const ProductCard = ({ product }) => {
  // No need for complex logic. We can access data directly.
  
  // Safely get the main image. If the product has no images, use a placeholder.
  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : '/images/sample.jpg';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
      
      {/* The link now reliably uses the top-level product ID */}
      <Link to={`/product/${product._id}`} className="block">
        <img className="w-full h-48 object-cover" src={mainImage} alt={product.name} />
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 truncate" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* This section for rating is optional but good practice */}
        <div className="my-2">
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </div>
        
        {/* This ensures the content below is pushed to the bottom */}
        <div className="mt-auto">
          {/* --- THIS IS THE FIX FOR THE PRICE --- */}
          {/* It now correctly displays the top-level 'product.price' */}
          <p className="text-xl font-bold text-gray-900">
            ₹{product.price ? product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;