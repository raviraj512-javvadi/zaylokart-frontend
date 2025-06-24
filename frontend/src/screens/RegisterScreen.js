import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';
import './LoginScreen.css'; 

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState(''); // <-- 1. ADDED STATE FOR PHONE
  const [message, setMessage] = useState(''); 
  const { userInfo, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return; // Stop submission if passwords don't match
    }
    // Added a check for the phone number
    if (!phone) {
        setMessage('Phone number is required');
        return;
    }

    setMessage('');
    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // <-- 2. ADDED PHONE TO THE REQUEST BODY
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }
      
      login(data);

    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={submitHandler}>
        <h1>Sign Up</h1>
        {message && <div className="error-message">{message}</div>}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        {/* --- 3. ADDED PHONE NUMBER INPUT FIELD --- */}
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        {/* -------------------------------------- */}

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" className="login-button">Sign Up</button>
        <div className="register-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterScreen;