import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../apiConfig';
import './LoginScreen.css'; // We can reuse the same styles

const LoginScreen = () => {
  // --- New State for OTP Flow ---
  const [step, setStep] = useState(1); // 1 for mobile input, 2 for OTP input
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { userInfo, login } = useAuth();
  const navigate = useNavigate();

  // Redirect the user if they are already logged in
  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  // --- Handler for Step 1: Sending the OTP ---
  const sendOtpHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }
      
      // If OTP is sent successfully, move to the next step
      setStep(2);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Handler for Step 2: Verifying the OTP & Logging In ---
  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, otpCode }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify OTP');
      }
      
      // If verification is successful, update the auth context
      login(data);
      // The useEffect will then handle the redirect to the homepage

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {step === 1 ? (
        // --- FORM FOR STEP 1: ENTER MOBILE NUMBER ---
        <form className="login-form" onSubmit={sendOtpHandler}>
          <h1>Login or Sign Up</h1>
          <p className="login-subtext">Enter your mobile number to get an OTP</p>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <div className="mobile-input-group">
              <span className="country-code">+91</span>
              <input 
                type="tel" 
                id="mobile" 
                value={mobileNumber} 
                onChange={(e) => setMobileNumber(e.target.value)} 
                placeholder="10-digit mobile number"
                required 
                pattern="[0-9]{10}"
              />
            </div>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        // --- FORM FOR STEP 2: ENTER OTP ---
        <form className="login-form" onSubmit={verifyOtpHandler}>
          <h1>Verify OTP</h1>
          <p className="login-subtext">Enter the 6-digit code sent to +91 {mobileNumber}</p>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="otp">OTP Code</label>
            <input 
              type="text" 
              id="otp" 
              value={otpCode} 
              onChange={(e) => setOtpCode(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
          <button type="button" className="link-button" onClick={() => setStep(1)}>
            Change mobile number
          </button>
        </form>
      )}
    </div>
  );
};

export default LoginScreen;