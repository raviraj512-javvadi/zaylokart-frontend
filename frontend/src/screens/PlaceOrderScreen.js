import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useCart();
  const { userInfo } = useAuth();

  // --- THIS IS THE FIX ---
  // Calculations are updated to remove tax.
  const itemsPrice = Number(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2));
  const shippingPrice = itemsPrice > 1000 ? 0 : 49;
  const taxPrice = 0; // Tax is now set to 0.
  const totalPrice = (itemsPrice + shippingPrice).toFixed(2); // Total no longer includes tax.
  // -------------------------

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice, // Sending tax as 0
          shippingPrice,
          totalPrice,
        }),
      });

      const createdOrder = await res.json();
      if (!res.ok) {
        throw new Error(createdOrder.message || 'Could not place order');
      }
      
      clearCart();
      navigate(`/order/success/${createdOrder._id}`);

    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Order Summary</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Shipping</h2>
            <p><strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            <p><strong>Method:</strong> {paymentMethod}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
            {cartItems.length === 0 ? <p>Your cart is empty</p> : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                    <div className="flex-grow">
                      <Link to={`/product/${item.product}`} className="font-semibold hover:underline">{item.name}</Link>
                      <p className="text-sm text-gray-500">{item.ram} / {item.storage}</p>
                    </div>
                    <div className="text-right">
                      {item.qty} x ₹{item.price.toLocaleString('en-IN')} = ₹{(item.qty * item.price).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Order Totals</h2>
            <div className="space-y-2">
              <p className="flex justify-between"><span>Items:</span> <span>₹{itemsPrice.toLocaleString('en-IN')}</span></p>
              <p className="flex justify-between"><span>Shipping:</span> <span>₹{shippingPrice.toLocaleString('en-IN')}</span></p>
              {/* --- THIS IS THE FIX: The tax row is now removed from view --- */}
              <hr className="my-2" />
              <p className="flex justify-between font-bold text-xl"><span>Total:</span> <span>₹{totalPrice.toLocaleString('en-IN')}</span></p>
            </div>
            <button
              type="button"
              className="w-full bg-gray-800 text-white font-bold py-3 px-6 rounded mt-6 hover:bg-gray-700 transition-colors disabled:bg-gray-400"
              disabled={cartItems.length === 0}
              onClick={placeOrderHandler}
            >
              Confirm Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
