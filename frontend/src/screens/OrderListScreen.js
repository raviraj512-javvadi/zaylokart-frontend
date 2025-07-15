import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ShieldX, Eye, Truck, IndianRupee } from 'lucide-react'; 
import API_URL from '../apiConfig';
import './OrderListScreen.css';

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo, logout } = useAuth(); // Assuming logout is available from your context
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    // Ensure we don't try to fetch if userInfo or token is missing
    if (!userInfo || !userInfo.token) {
        navigate('/login');
        return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      // --- THIS IS THE FIX ---
      // Specifically check for a 401 Unauthorized error from the server
      if (response.status === 401) {
        // If the token is invalid/expired, log the user out and redirect to login.
        if(logout) logout(); // Call the logout function from your context if it exists
        navigate('/login?message=Session expired. Please log in again.');
        return; // Stop the function here to prevent further errors
      }
      // ----------------------

      if (!response.ok) {
        // Try to get a more specific error message from the backend
        const errorData = await response.json();
        throw new Error(errorData.message || 'Could not fetch orders.');
      }

      const data = await response.json();
      setOrders(data);
      setError(null); // Clear any previous errors on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userInfo, navigate, logout]); // Added logout to dependency array

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchOrders();
    } else {
      // If user is not an admin, redirect them away.
      navigate('/login');
    }
  }, [userInfo, navigate, fetchOrders]);


  const markAsDeliveredHandler = async (orderId) => {
    // This function can be improved with the same 401 check, but we'll focus on the main fetch first.
    if (window.confirm('Are you sure you want to mark this order as delivered?')) {
      try {
        await fetch(`${API_URL}/api/orders/${orderId}/deliver`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        fetchOrders(); 
      } catch (err) {
        alert('Error updating order to delivered.');
      }
    }
  };

  const markAsPaidHandler = async (orderId) => {
    // This function can also be improved with the same 401 check.
    if (window.confirm('Are you sure you want to mark this order as paid?')) {
      try {
        await fetch(`${API_URL}/api/orders/${orderId}/pay`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        fetchOrders();
      } catch (err) {
        alert('Error updating order to paid.');
      }
    }
  };

  if (loading) return <div className="loading-spinner">Loading Orders...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="admin-screen-container">
      <div className="admin-header">
        <h1 className="admin-title">All Orders</h1>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user ? order.user.name : 'N/A'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>₹{order.totalPrice.toLocaleString('en-IN')}</td>
                <td>
                  {order.isPaid ? (
                    <ShieldCheck color="green" size={20} />
                  ) : (
                    <ShieldX color="red" size={20} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <ShieldCheck color="green" size={20} />
                  ) : (
                    <ShieldX color="red" size={20} />
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <Link to={`/order/success/${order._id}`} className="icon-btn" title="View Details">
                      <Eye size={18} />
                    </Link>
                    {!order.isPaid && (
                      <button className="icon-btn" title="Mark as Paid" onClick={() => markAsPaidHandler(order._id)}>
                        <IndianRupee size={18} />
                      </button>
                    )}
                    {!order.isDelivered && (
                      <button className="icon-btn" title="Mark as Delivered" onClick={() => markAsDeliveredHandler(order._id)}>
                        <Truck size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListScreen;
