import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../firebase'; // Import auth from our new firebase.js file
import API_URL from '../apiConfig';
import './LoginScreen.css';

const LoginScreen = () => {
  // State for the new OTP flow
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 for mobile input, 2 for OTP input
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { userInfo, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already logged in
  useEffect(() => {
    if (userInfo) {
      navigate(-1); // Go back to the previous page
    }
  }, [userInfo, navigate]);

  // Function to set up the invisible ReCaptcha
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }

  // Handler for Step 1: Sending the OTP
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
      setStep(2); // Move to OTP entry step
    } catch (err) {
      console.error("Firebase OTP Send Error:", err);
      setError('Failed to send OTP. Please check the mobile number and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler for Step 2: Verifying the OTP and Logging In
  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(otp);
      const user = userCredential.user;

      // Get the Firebase ID Token
      const idToken = await user.getIdToken();
      
      // THIS IS THE FINAL STEP: Send the token to our own backend
      // We will build this backend part next
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
      
      // If our server confirms the login, update the context
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
      {/* This div is for the invisible ReCaptcha widget */}
      <div id="recaptcha-container"></div>

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
            {loading ? 'Sending OTP...' : 'Send OTP'}
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