import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';

const CartScreen = () => {
  const navigate = useNavigate();
  // Use the new, upgraded cart context
  const { cartItems, addToCart, removeFromCart } = useCart();

  // Calculate totals based on the items in the cart
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  // This handler updates the quantity by re-adding the item with the new quantity
  const handleQtyChange = (item, newQty) => {
    addToCart(
        { _id: item.product, name: item.name, images: [item.image] }, 
        newQty, 
        { _id: item.variant, price: item.price, ram: item.ram, storage: item.storage, countInStock: item.countInStock }
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.length === 0 ? (
            <div className="bg-blue-100 text-blue-700 p-4 rounded-lg">
              Your cart is empty. <Link to="/" className="font-bold hover:underline">Go Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.variant} className="flex items-center bg-white p-4 rounded-lg shadow">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
                  <div className="flex-grow">
                    <Link to={`/product/${item.product}`} className="font-semibold text-lg hover:underline">{item.name}</Link>
                    {/* Display the variant details */}
                    <p className="text-sm text-gray-600">{item.ram} / {item.storage}</p>
                    <p className="text-md font-bold mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center">
                    <select value={item.qty} onChange={(e) => handleQtyChange(item, Number(e.target.value))} className="mx-4 p-2 border rounded">
                      {[...Array(item.countInStock).keys()].map(x => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>
                    <button onClick={() => removeFromCart(item.variant)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subtotal and Checkout Section */}
        {cartItems.length > 0 && (
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Subtotal ({totalItems}) items</h2>
              <p className="text-2xl font-bold mb-6">₹{itemsPrice.toLocaleString('en-IN')}</p>
              <button onClick={checkoutHandler} className="w-full bg-gray-800 text-white font-bold py-3 px-6 rounded hover:bg-gray-700 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartScreen;
