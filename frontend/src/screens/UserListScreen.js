import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ShieldX, Trash2 } from 'lucide-react';
import API_URL from '../apiConfig';
import './UserListScreen.css'; // Import the new CSS file

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // This is the API call to the new route we created on the backend
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`, // Must include token for admin access
        },
      });

      if (!response.ok) {
        throw new Error('Could not fetch users.');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      // We will build the delete functionality in a future step
      alert(`User delete functionality for ${id} is not yet implemented.`);
    }
  };

  if (loading) return <div className="loading-spinner">Loading Users...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="admin-screen-container">
      <div className="admin-header">
        <h1 className="admin-title">Users</h1>
      </div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                <td>
                  {user.isAdmin ? (
                    <ShieldCheck color="green" size={20} />
                  ) : (
                    <ShieldX color="red" size={20} />
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {/* We only show the delete button for non-admin users */}
                    {!user.isAdmin && (
                        <button className="icon-btn-danger" title="Delete User" onClick={() => deleteHandler(user._id)}>
                            <Trash2 size={18} />
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

export default UserListScreen;