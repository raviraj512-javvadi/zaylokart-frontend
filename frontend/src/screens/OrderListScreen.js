import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// --- Import the new icon ---
import { ShieldCheck, ShieldX, Eye, Truck, IndianRupee } from 'lucide-react'; 
import API_URL from '../apiConfig';
import './OrderListScreen.css';

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Could not fetch orders.');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate, fetchOrders]);


  const markAsDeliveredHandler = async (orderId) => {
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

  // --- THIS IS THE NEW FUNCTION FOR MARKING AS PAID ---
  const markAsPaidHandler = async (orderId) => {
    if (window.confirm('Are you sure you want to mark this order as paid?')) {
      try {
        await fetch(`${API_URL}/api/orders/${orderId}/pay`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        fetchOrders(); // Refresh the list to show the change
      } catch (err) {
        alert('Error updating order to paid.');
      }
    }
  };
  // --------------------------------------------------------

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

                    {/* --- THIS IS THE NEW "MARK AS PAID" BUTTON --- */}
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