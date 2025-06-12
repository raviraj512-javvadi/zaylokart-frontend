import React from 'react';
import { useParams } from 'react-router-dom';

// The component receives the list of products as a prop
const ProductDetails = ({ products }) => {
  // Get the 'id' from the URL
  const { id } = useParams();

  // Find the product from the props that matches the id
  const product = products.find(p => p.id === id);

  // If no product is found for the given id, show an error
  if (!product) {
    return <div>Product not found!</div>;
  }

  // Render the details of the found product
  return (
    <div className="product-details-container p-8">
      <img src={product.image} alt={product.title} className="w-1/3 mx-auto" />
      <div className="product-details-info text-center mt-4">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-lg text-gray-600 my-2">{product.description}</p>
        <p className="text-2xl font-bold text-green-600">{product.price}</p>
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-blue-700">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;