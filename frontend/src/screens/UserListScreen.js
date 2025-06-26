import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // <-- Import Link
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ShieldX, Trash2, Edit } from 'lucide-react';
import API_URL from '../apiConfig';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  // Function to fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Could not fetch users.');
      }
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

  // --- NEW: Implemented Delete Handler ---
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Could not delete user.');
        }

        // Refetch users to update the list
        fetchUsers(); 
      } catch (err) {
        alert(err.message);
      }
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading Users...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">ID</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Phone</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Address</th>
              <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Admin</th>
              <th className="text-center py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-4">{user._id}</td>
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4"><a href={`mailto:${user.email}`} className="text-blue-500">{user.email}</a></td>
                <td className="py-3 px-4">{user.phone || 'N/A'}</td>
                <td className="py-3 px-4">{user.shippingAddress ? `${user.shippingAddress.address}, ${user.shippingAddress.city}` : 'N/A'}</td>
                <td className="py-3 px-4 text-center">
                  {user.isAdmin ? <ShieldCheck color="green" className="inline-block" /> : <ShieldX color="red" className="inline-block" />}
                </td>
                <td className="py-3 px-4 text-center">
                  {/* --- NEW: Changed Edit button to a Link --- */}
                  <Link to={`/admin/user/${user._id}/edit`} className="text-blue-500 hover:text-blue-700 mr-4">
                    <Edit size={18} />
                  </Link>
                  {/* --- NEW: Delete button now calls deleteHandler --- */}
                  <button onClick={() => deleteHandler(user._id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
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
