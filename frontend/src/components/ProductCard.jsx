import React from 'react';
import { Link } from 'react-router-dom';
// You can add a rating component here if you have one
// import Rating from './Rating'; 

const ProductCard = ({ product }) => {
  // --- THIS IS THE CRITICAL FIX ---
  // We get the price from the *first variant* in the array.
  // We also check if variants exist to prevent errors.
  const displayPrice = product.variants && product.variants.length > 0 
    ? product.variants[0].price 
    : 0;

  // We also get the main image from the new images array
  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : '/images/sample.jpg'; // A fallback image

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      <Link to={`/product/${product._id}`}>
        <img className="w-full h-48 object-cover" src={mainImage} alt={product.name} />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
        </Link>
        {/* <Rating value={product.rating} text={`${product.numReviews} reviews`} /> */}
        <p className="text-xl font-bold text-gray-900 mt-2">
          ₹{displayPrice.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
