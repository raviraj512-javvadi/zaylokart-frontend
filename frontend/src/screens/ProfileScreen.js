import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import API_URL from '../apiConfig'; 

const ProfileScreen = () => {
  const { userInfo, login: updateAuthContext } = useAuth();
  
  // State for user details form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  // State for password update form
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State for orders
  const [orders, setOrders] = useState([]);
  
  // State for messages and loading
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Set initial form values when component mounts
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhone(userInfo.phone || '');
    } else {
        // If no user info, we shouldn't be here. Redirect to login.
        navigate('/login');
    }
  }, [userInfo, navigate]);

  // Fetch user's orders when component mounts
  useEffect(() => {
    const fetchMyOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_URL}/api/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Could not fetch orders.');
        }
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchMyOrders();
    }
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
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h2>
          
          {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
          
          <form onSubmit={handleProfileUpdate}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Phone Number</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <hr className="my-6"/>
            <p className="text-gray-600 text-sm mb-4">Leave fields blank to keep current password.</p>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">New Password</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm New Password</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300" type="submit">
              Update Profile
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
          {loading ? <p>Loading orders...</p> : (
            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3 text-center">Paid</th>
                    <th className="px-5 py-3 text-center">Delivered</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-5 py-5 text-sm">{order._id}</td>
                      <td className="px-5 py-5 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-5 text-sm">₹{order.totalPrice.toFixed(2)}</td>
                      <td className="px-5 py-5 text-sm text-center">
                        {order.isPaid ? '✅' : '❌'}
                      </td>
                      <td className="px-5 py-5 text-sm text-center">
                        {order.isDelivered ? '✅' : '❌'}
                      </td>
                      <td className="px-5 py-5 text-sm">
                        <button onClick={() => navigate(`/order/${order._id}`)} className="text-blue-500 hover:underline">Details</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                        <td colSpan="6" className="text-center py-10">You have no orders.</td>
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