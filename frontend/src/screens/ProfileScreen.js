import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import API_URL from '../apiConfig'; 

// Import the CSS file
import './ProfileScreen.css';

const ProfileScreen = () => {
  const { userInfo, login: updateAuthContext } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhone(userInfo.phone || '');
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (userInfo) {
        try {
          setLoading(true);
          const response = await fetch(`${API_URL}/api/orders/myorders`, {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'Could not fetch orders.');
          setOrders(data);
        } catch (err) {
          setError(err.message);
        } finally {
            setLoading(false);
        }
      }
    };
    fetchMyOrders();
  }, [userInfo]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if(password && (password !== confirmPassword)) {
        setError("Passwords do not match!");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
            body: JSON.stringify({ name, email, phone, password }),
        });
        
        const data = await res.json();
        if(!res.ok){
            throw new Error(data.message || 'Failed to update profile.');
        }
        
        updateAuthContext(data); 
        setMessage('Profile updated successfully!');
        setPassword('');
        setConfirmPassword('');

    } catch(err) {
        setError(err.message);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-grid">
        
        {/* Left Column: Profile Form */}
        <div className="profile-form-card">
          <h2>User Profile</h2>
          
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Name</label>
              <input className="form-input" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input className="form-input" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Phone Number</label>
              <input className="form-input" id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            
            <hr className="form-divider"/>
            
            <p className="form-note">Leave fields blank to keep current password.</p>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">New Password</label>
              <input className="form-input" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
              <input className="form-input" id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            
            <button className="form-button" type="submit">
              Update Profile
            </button>
          </form>
        </div>

        {/* Right Column: Orders Table */}
        <div className="orders-card">
          <h2>My Orders</h2>
          {loading ? <p>Loading orders...</p> : (
            <div className="orders-table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Delivered</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? orders.map((order) => (
                    <tr key={order._id}>
                      {/* --- THIS IS THE FIX --- */}
                      {/* data-label attributes have been added for the mobile view */}
                      <td data-label="ID">{order._id}</td>
                      <td data-label="Date">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td data-label="Total">₹{order.totalPrice.toFixed(2)}</td>
                      <td data-label="Paid" className={order.isPaid ? 'status-paid' : 'status-not-paid'}>
                        {order.isPaid ? 'Yes' : 'No'}
                      </td>
                      <td data-label="Delivered" className={order.isDelivered ? 'status-paid' : 'status-not-paid'}>
                        {order.isDelivered ? 'Yes' : 'No'}
                      </td>
                      <td data-label="Actions">
                        <button onClick={() => navigate(`/order/success/${order._id}`)} className="details-btn">Details</button>
                      </td>
                      {/* ------------------------- */}
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>You have no orders.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
