import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';
import './PlaceOrderScreen.css';

const PlaceOrderScreen = () => {
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useCart(); // Use clearCart
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const itemsPrice = cartItems.reduce((acc, item) => acc + Number(item.qty) * Number(item.price), 0);
  const shippingPrice = 49;
  const totalPrice = itemsPrice + shippingPrice;

  // --- THIS IS THE FINAL, UPDATED LOGIC ---
  const placeOrderHandler = async () => {
    try {
      // 1. Send the order details to your backend to save in the database
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
          isPaid: false, // For COD/UPI at Delivery, this is always false initially
          paidAt: null,
        }),
      });
      
      const createdOrder = await res.json();
      if (!res.ok) {
        throw new Error(createdOrder.message || 'Could not place order');
      }
      
      // 2. Clear the cart from local storage now that the order is placed
      clearCart();

      // 3. Redirect the user to the new "Order Success" page with the new Order ID
      navigate(`/order/success/${createdOrder._id}`);

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

        {/* This section now shows the chosen payment method */}
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
                <div key={item.cartId} className="order-item">
                  <img
                    src={`${API_URL}${item.imageUrl}`}
                    alt={item.name}
                    className="order-item-image"
                  />
                  <Link to={`/product/${item._id}`} className="order-item-name">
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
          Place Order
        </button>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;