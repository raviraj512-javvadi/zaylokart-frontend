import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API_URL from '../apiConfig'; // <-- 1. IMPORT THE API URL CONFIG

const ProfileScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo) {
        setLoading(false);
        return;
      }
      try {
        // --- 2. UPDATE this fetch call to use the API_URL ---
        const response = await fetch(`${API_URL}/api/orders/myorders`, {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Could not fetch orders.');
        }
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>My Orders</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>You have no orders. <Link to="/">Go Shopping</Link></p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>DATE</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>TOTAL</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>PAID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>DELIVERED</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{order._id}</td>
                <td style={{ padding: '12px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>₹{order.totalPrice.toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px' }}>{order.isPaid ? new Date(order.paidAt).toLocaleDateString() : 'No'}</td>
                <td style={{ padding: '12px' }}>{order.isDelivered ? new Date(order.deliveredAt).toLocaleDateString() : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProfileScreen;