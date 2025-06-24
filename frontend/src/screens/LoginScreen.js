import React, { useState, useEffect } from 'react';
// --- THE ONLY CHANGE IS ON THIS LINE: 'Link' has been removed ---
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../firebase';
import API_URL from '../apiConfig';
import './LoginScreen.css';

const LoginScreen = () => {
  // --- All the rest of the code is already correct ---
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { userInfo, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate(-1);
    }
  }, [userInfo, navigate]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => { /* ... */ }
      });
    }
  }

  const sendOtpHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const formattedPhoneNumber = `+91${mobileNumber}`;
      
      const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
      
      setConfirmationResult(result);
      setStep(2);
    } catch (err) {
      console.error("Firebase OTP Send Error:", err);
      setError('Failed to send OTP. Please check the mobile number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(otp);
      const user = userCredential.user;
      
      const idToken = await user.getIdToken();
      
      const response = await fetch(`${API_URL}/api/users/login-firebase`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
          }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to login with our server.');
      }
      
      login(data);

    } catch (err) {
      console.error("Firebase OTP Verify Error:", err);
      setError('Failed to verify OTP. Please check the code or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div id="recaptcha-container"></div>

      {step === 1 ? (
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
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form className="login-form" onSubmit={verifyOtpHandler}>
          <h1>Verify OTP</h1>
          <p className="login-subtext">Enter the 6-digit code sent to +91 {mobileNumber}</p>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="otp">OTP Code</label>
            <input 
              type="text" 
              id="otp" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
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