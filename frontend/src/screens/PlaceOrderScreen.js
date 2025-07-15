import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';

// Import the new CSS file
import './PlaceOrderScreen.css';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useCart();
  const { userInfo } = useAuth();

  const itemsPrice = Number(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2));
  const shippingPrice = itemsPrice > 1000 ? 0 : 49;
  const taxPrice = 0;
  const totalPrice = (itemsPrice + shippingPrice).toFixed(2);

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
          taxPrice,
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
    <div className="place-order-container">
      <h1 className="place-order-title">Order Summary</h1>
      <div className="place-order-grid">
        {/* Left Column */}
        <div>
          <div className="info-card">
            <h2>Shipping</h2>
            <p><strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}</p>
          </div>
          <div className="info-card">
            <h2>Payment Method</h2>
            <p><strong>Method:</strong> {paymentMethod}</p>
          </div>
          <div className="info-card">
            <h2>Order Items</h2>
            {cartItems.length === 0 ? <p>Your cart is empty</p> : (
              <div className="order-items-list">
                {cartItems.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} className="order-item-image" />
                    <div className="order-item-details">
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                      <p className="item-variant">{item.ram} / {item.storage}</p>
                    </div>
                    <div className="order-item-total">
                      {item.qty} x ₹{item.price.toLocaleString('en-IN')} = ₹{(item.qty * item.price).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="order-summary-box">
            <h2>Order Totals</h2>
            <div className="summary-row">
              <span>Items:</span>
              <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>₹{shippingPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-total-row">
              <span>Total:</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <button
              type="button"
              className="place-order-btn"
              disabled={cartItems.length === 0}
              onClick={placeOrderHandler}
            >
              Confirm & Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
