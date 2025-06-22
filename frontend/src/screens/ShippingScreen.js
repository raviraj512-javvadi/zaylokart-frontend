import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './LoginScreen.css'; // It's okay to reuse styles

const ShippingScreen = () => {
  const { shippingAddress, saveShippingAddress } = useCart();
  const navigate = useNavigate();

  // FIX: Safely initialize state to prevent crash if shippingAddress is empty on load
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    // UPDATE: Navigate to the payment screen next, as per your plan
    navigate('/payment');
  };
  
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={submitHandler}>
        <h1>Shipping Address</h1>
        <div className="form-group">
          <label>Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>City</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Postal Code</label>
          <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>
        <button type="submit" className="login-button">Continue to Payment</button>
      </form>
    </div>
  );
};

export default ShippingScreen;