import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';
import API_URL from '../apiConfig';
import './OrderSuccessScreen.css';
// --- I will assume your QR code image is placed in this path ---
// --- You will need to add your QR image to the `frontend/public/images` folder ---
import qrCodeImage from '/images/your-qr-code.png'; // <-- IMPORTANT: UPDATE THIS PATH

const OrderSuccessScreen = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Could not fetch order details.');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrder();
    }
  }, [orderId, userInfo]);

  if (loading) return <div className="loading-spinner">Loading Order Details...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!order) return <div className="error-message">Order not found.</div>;

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <CheckCircle className="success-icon" size={80} />
        <h1 className="success-title">Thank You For Your Order!</h1>
        <p className="success-message">Your order has been placed successfully.</p>
        <p className="success-order-id">
          Order ID: <span>{order._id}</span>
        </p>

        {/* --- Order Summary Section --- */}
        <div className="order-summary-section">
          <h3>Order Summary</h3>
          {order.orderItems.map((item) => (
            <div key={item.product} className="summary-item">
              <img src={item.image} alt={item.name} className="summary-item-image" />
              <div className="summary-item-details">
                <span>{item.name} ({item.size})</span>
                <span>Qty: {item.qty}</span>
              </div>
              <span className="summary-item-price">₹{(item.qty * item.price).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="summary-total">
            <strong>Total:</strong>
            <strong>₹{order.totalPrice.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {/* --- Payment Instructions Section --- */}
        <div className="payment-instructions-section">
            <h3>Payment Instructions</h3>
            {order.paymentMethod === 'Cash on Delivery' ? (
                <p>Please keep the exact amount of ₹{order.totalPrice.toLocaleString('en-IN')} ready. Our delivery partner will collect it upon arrival.</p>
            ) : (
                <div className="qr-payment">
                    <p>Please scan the QR code below using any UPI app to complete your payment. Mention your Order ID in the notes.</p>
                    <img src={qrCodeImage} alt="UPI QR Code" className="qr-code-image" />
                </div>
            )}
        </div>

        <Link to="/profile" className="success-button">VIEW MY ORDERS</Link>
        <Link to="/" className="continue-shopping-link">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderSuccessScreen;