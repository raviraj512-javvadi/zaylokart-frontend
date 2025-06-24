import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ShieldX, Trash2, Edit } from 'lucide-react';
import API_URL from '../apiConfig'; // <-- IMPORT THE API URL CONFIG

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userInfo || !userInfo.isAdmin) {
        setError("Access Denied.");
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching users from: ${API_URL}/api/users`); // Debugging line

        // --- THIS IS THE CRUCIAL FIX ---
        // We now use the full URL from apiConfig.js
        const response = await fetch(`${API_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        // -----------------------------

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`Server responded with an error: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);

      } catch (err) {
        console.error('Fetch Operation Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userInfo, navigate]);

  const deleteHandler = (id) => {
    alert(`Delete functionality for user ${id} is not yet implemented.`);
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
                   <button onClick={() => alert('Edit not implemented')} className="text-blue-500 hover:text-blue-700 mr-2"><Edit size={18} /></button>
                   <button onClick={() => deleteHandler(user._id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
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