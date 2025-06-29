import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating'; // Assuming you have a Rating component

const ProductCard = ({ product }) => {
  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : '/images/sample.jpg';

  // This component now uses the class names from your CSS files (e.g., ProductGrid.css)
  // instead of Tailwind CSS. This will fix the grid layout conflict.
  return (
    <div className="card"> {/* This now uses the .card style from your CSS */}
      <Link to={`/product/${product._id}`}>
        <img className="card-image" src={mainImage} alt={product.name} />
      </Link>
      <div className="card-body">
        <Link to={`/product/${product._id}`}>
          <h3 className="card-title" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* The flexbox styles on .card-body and flex-grow on .card-title will handle spacing */}
        <div className="my-2"> {/* You may need to add a small margin style for this class if you want space */}
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </div>
        
        <p className="card-price">
          ₹{product.price ? product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
