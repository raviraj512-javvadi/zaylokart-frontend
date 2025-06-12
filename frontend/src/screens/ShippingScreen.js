import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './LoginScreen.css'; // Reuse login screen styles

const ShippingScreen = () => {
  const { shippingAddress, saveShippingAddress } = useCart();
  const navigate = useNavigate();

  // Pre-fill form with data from context/localStorage, or use empty strings
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

 // ... inside ShippingScreen.js
const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    navigate('/placeorder'); // Change this line
  };
// ...
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
        <button type="submit" className="login-button">Continue</button>
      </form>
    </div>
  );
};

export default ShippingScreen;