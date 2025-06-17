import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './PaymentScreen.css';
// Reusing form styles

const PaymentScreen = () => {
  const navigate = useNavigate();
  const { shippingAddress, savePaymentMethod } = useCart();

  if (!shippingAddress.address) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('UPI at Delivery');

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
    navigate('/placeorder');
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={submitHandler}>
        <h1>Payment Method</h1>
        <div className="form-group payment-method-options">
          <label>Select Method</label>
          <label className={`payment-option ${paymentMethod === 'UPI at Delivery' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="UPI at Delivery"
              checked={paymentMethod === 'UPI at Delivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>🧾 UPI at Delivery</span>
          </label>
          <label className={`payment-option ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="paymentMethod"
              value="Cash on Delivery"
              checked={paymentMethod === 'Cash on Delivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span>💵 Cash on Delivery</span>
          </label>
        </div>
        <button type="submit" className="login-button">Continue</button>
      </form>
    </div>
  );
};

export default PaymentScreen;
