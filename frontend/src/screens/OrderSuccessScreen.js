import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import './OrderSuccessScreen.css';

const OrderSuccessScreen = () => {
  const { id: orderId } = useParams();

  return (
    <div className="order-success-container">
      <div className="order-success-card">
        <CheckCircle className="success-icon" size={80} />
        <h1 className="success-title">Thank You For Your Order!</h1>
        <p className="success-message">Your order has been placed successfully.</p>
        <p className="success-order-id">
          Your Order ID is: <span>{orderId}</span>
        </p>
        <p className="success-info">You will receive an order confirmation email with details of your order.</p>
        <Link to="/profile" className="success-button">VIEW ORDERS</Link>
        <Link to="/" className="continue-shopping-link">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderSuccessScreen;