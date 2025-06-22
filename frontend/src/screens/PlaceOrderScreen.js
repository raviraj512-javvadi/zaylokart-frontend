import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';
import './PlaceOrderScreen.css'; // Make sure you have this CSS file

const PlaceOrderScreen = () => {
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  // --- Temporary Debugging Line ---
  // This will tell us in the browser console what data is missing.
  console.log('DATA CHECK:', { shippingAddress, paymentMethod, cartItems });

  useEffect(() => {
    // This logic ensures users don't skip steps
    if (!shippingAddress?.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);

  // This guard clause prevents the page from crashing if data is missing
  if (!cartItems || !shippingAddress?.address || !paymentMethod) {
    return <div>Loading...</div>; // Show loading text instead of a blank page
  }

  // All calculations are safe now
  const itemsPrice = cartItems.reduce((acc, item) => acc + Number(item.qty) * Number(item.price), 0);
  const shippingPrice = 49;
  const totalPrice = itemsPrice + shippingPrice;

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
          totalPrice,
        }),
      });
      
      const createdOrder = await res.json();
      if (!res.ok) {
        throw new Error(createdOrder.message || 'Could not place order');
      }
      
      clearCart();
      // After placing the order, navigate to the new order's details page
      navigate(`/order/${createdOrder._id}`); 
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
            {shippingAddress.address}, {shippingAddress.city}<br />
            {shippingAddress.postalCode}, {shippingAddress.country}
          </p>
        </div>

        <div className="placeorder-section">
          <h2>Payment Method</h2>
          <p>
            <strong>Method: </strong>
            {paymentMethod}
          </p>
        </div>

        <div className="placeorder-section">
          <h2>Order Items</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="order-items-list">
              {cartItems.map((item) => (
                <div key={item.product} className="order-item">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="order-item-image"
                  />
                  <Link to={`/product/${item.product}`} className="order-item-name">
                    {item.name} ({item.size})
                  </Link>
                  <div className="order-item-summary">
                    {item.qty} x ₹{item.price.toLocaleString('en-IN')} = ₹
                    {(item.qty * item.price).toLocaleString('en-IN')}
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
          <span>Items</span><span>₹{itemsPrice.toLocaleString('en-IN')}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span><span>₹{shippingPrice.toLocaleString('en-IN')}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>
            ₹{totalPrice.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <button
          className="action-button"
          disabled={cartItems.length === 0}
          onClick={placeOrderHandler}
        >
          Confirm Place Order
        </button>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;