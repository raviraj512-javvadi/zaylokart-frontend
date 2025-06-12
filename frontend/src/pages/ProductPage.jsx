import React from 'react';
import { useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductPage = ({ products }) => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === id);

  if (!product) {
    return <div className="text-center py-20">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="bg-brand-gray p-4">
          <img src={product.image} alt={product.name} className="w-full h-auto object-cover" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-dark mb-3">{product.name}</h1>
          <p className="text-3xl font-medium text-brand-dark mb-4">₹{product.price.toLocaleString('en-IN')}</p>
          <div className="flex items-center mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} strokeWidth={1.5} fill={i < product.rating ? 'currentColor' : 'none'} size={22} />
              ))}
            </div>
            <span className="ml-3 text-gray-500">({product.reviewCount} Reviews)</span>
          </div>
          <p className="text-gray-700 leading-relaxed mb-8">
            {product.description}
          </p>
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-brand-dark text-white font-bold py-4 px-8 text-lg hover:bg-brand-accent transition-colors duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;