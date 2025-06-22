import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';
import './PlaceOrderScreen.css';

const PlaceOrderScreen = () => {
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // This effect ensures that if a user lands on this page by mistake,
    // they are sent back to the correct step.
    if (!shippingAddress?.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [shippingAddress, paymentMethod, navigate]);


  // ======================= THE DEFINITIVE FIX =======================
  // This is a "guard clause". It stops the component from rendering
  // anything until all the required data has been loaded from the context.
  // This prevents any "cannot read property of null" crashes.
  if (!cartItems || !shippingAddress?.address || !paymentMethod) {
    // You can show a loading spinner here, but returning null is the cleanest way
    // to prevent a crash, as the useEffect above will redirect instantly.
    return null;
  }
  // ====================================================================


  // All calculations below are now 100% safe because of the guard clause above.
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
      
      // Navigate to the order details page upon success
      navigate(`/order/${createdOrder._id}`); 
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // The JSX below is now 100% safe to render.
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
          Place Order
        </button>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;