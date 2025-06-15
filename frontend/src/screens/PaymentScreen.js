import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './LoginScreen.css'; // We can reuse these form styles

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
        <div className="form-group">
          <label>Select Method</label>
          <div className="radio-group">
            <input
              type="radio"
              id="upi"
              name="paymentMethod"
              value="UPI at Delivery"
              checked={paymentMethod === 'UPI at Delivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="upi">UPI at Delivery</label>
          </div>
          <div className="radio-group">
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value="Cash on Delivery"
              checked={paymentMethod === 'Cash on Delivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="cod">Cash on Delivery</label>
          </div>
        </div>
        <button type="submit" className="login-button">Continue</button>
      </form>
    </div>
  );
};

export default PaymentScreen;