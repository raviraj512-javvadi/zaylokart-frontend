import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ShieldX, Eye } from 'lucide-react';
import API_URL from '../apiConfig';
import './OrderListScreen.css'; // Import the new CSS file

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // This is the API call to the new route we created on the backend
        const response = await fetch(`${API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`, // Must include token for admin access
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
    };

    if (userInfo && userInfo.isAdmin) {
      fetchOrders();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

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
                  <Link to={`/order/success/${order._id}`} className="icon-btn">
                    <Eye size={18} />
                  </Link>
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