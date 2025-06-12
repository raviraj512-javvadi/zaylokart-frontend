import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems } = useCart();

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-8">Your cart is currently empty.</p>
          <Link to="/" className="bg-brand-dark text-white font-bold py-3 px-8 hover:bg-brand-accent transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center border-b py-4">
                <img src={item.image} alt={item.name} className="w-24 h-32 object-cover mr-4" />
                <div className="flex-grow">
                  <h2 className="font-bold">{item.name}</h2>
                  <p className="text-gray-600">₹{item.price.toLocaleString('en-IN')}</p>
                </div>
                <button className="text-red-500 hover:text-red-700">Remove</button>
              </div>
            ))}
          </div>
          <div className="bg-brand-gray p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{cartItems.reduce((acc, item) => acc + item.price, 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total</span>
              <span>₹{cartItems.reduce((acc, item) => acc + item.price, 0).toLocaleString('en-IN')}</span>
            </div>
            <button className="w-full bg-brand-dark text-white font-bold py-3 mt-6 hover:bg-brand-accent transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;