import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    // The main container now uses className="card"
    <div className="card">
      <Link to={`/product/${product._id}`}>
        {/* The image now uses className="card-image" */}
        <img className="card-image" src={product.imageUrl} alt={product.name} />
      </Link>
      
      {/* The info container now uses className="card-body" */}
      <div className="card-body">
        <div>
          {/* The title now uses className="card-title" */}
          <h3 className="card-title">
            <Link to={`/product/${product._id}`}>{product.name}</Link>
          </h3>
        </div>
        
        {/* The price now uses className="card-price" */}
        <p className="card-price">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
};

export default ProductCard;