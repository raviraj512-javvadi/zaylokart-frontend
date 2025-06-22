import React, { useState, useEffect, useCallback } from 'react'; // <-- import useCallback
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ShieldX, Eye, Truck } from 'lucide-react'; // <-- import Truck icon
import API_URL from '../apiConfig';
import './OrderListScreen.css';

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  // We define fetchOrders here so it can be called from multiple places
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
  }, [userInfo]); // <-- Add userInfo as a dependency

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate, fetchOrders]);


  // --- THIS IS THE NEW FUNCTION TO HANDLE THE UPDATE ---
  const markAsDeliveredHandler = async (orderId) => {
    if (window.confirm('Are you sure you want to mark this order as delivered?')) {
      try {
        await fetch(`${API_URL}/api/orders/${orderId}/deliver`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        // After updating, refresh the list of orders to show the change
        fetchOrders(); 
      } catch (err) {
        alert('Error updating order.');
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
                    {/* --- THIS IS THE NEW BUTTON --- */}
                    {/* It only shows if the order is NOT already delivered */}
                    {!order.isDelivered && (
                      <button className="icon-btn" title="Mark as Delivered" onClick={() => markAsDeliveredHandler(order._id)}>
                        <Truck size={18} />
                      </button>
                    )}
                    {/* ----------------------------- */}
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