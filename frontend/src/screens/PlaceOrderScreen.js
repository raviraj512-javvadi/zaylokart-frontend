import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './PlaceOrderScreen.css';

const PlaceOrderScreen = () => {
  const { cartItems, shippingAddress, removeFromCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  // --- UPDATED Calculations ---
  const itemsPrice = cartItems.reduce((acc, item) => acc + Number(item.qty) * Number(item.price), 0);
  const shippingPrice = 49; // UPDATED: Set to a flat rate of 49
  const taxPrice = 0;       // REMOVED: Tax is set to 0
  const totalPrice = itemsPrice + shippingPrice + taxPrice; // This calculation now correctly reflects the changes

  const placeOrderHandler = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems: cartItems,
          shippingAddress,
          totalPrice: totalPrice, // Send the new total price
        }),
      });
      
      const createdOrder = await response.json();

      if (!response.ok) {
        throw new Error(createdOrder.message || 'Could not place order');
      }
      
      for (const item of cartItems) {
        removeFromCart(item.cartId);
      }
      
      alert('Order placed successfully!');
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="placeorder-container">
      <div className="placeorder-details">
        <div className="placeorder-section">
          <h2>Shipping Address</h2>
          <p>
            {shippingAddress.address}, {shippingAddress.city}<br/>
            {shippingAddress.postalCode}, {shippingAddress.country}
          </p>
        </div>

        <div className="placeorder-section">
          <h2>Order Items</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="order-items-list">
              {cartItems.map((item) => (
                <div key={item.cartId} className="order-item">
                  <img src={item.imageUrl} alt={item.name} className="order-item-image" />
                  <Link to={`/product/${item._id}`} className="order-item-name">
                    {item.name} ({item.size})
                  </Link>
                  <div className="order-item-summary">
                    {item.qty} x ₹{item.price.toLocaleString('en-IN')} = ₹{(item.qty * item.price).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="placeorder-summary-card">
        <h2>Order Summary</h2>
        <div className="summary-row">
          <span>Items</span>
          <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>₹{shippingPrice.toLocaleString('en-IN')}</span>
        </div>
        
        {/* The Tax row has been completely removed from display */}

        <div className="summary-row total">
          <span>Total</span>
          <span>₹{totalPrice.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </div>
        <button
          className="action-button"
          disabled={cartItems.length === 0}
          onClick={placeOrderHandler}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;