import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming this is your auth context
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ShieldX, Trash2, Edit } from 'lucide-react';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // This effect will run once when the component mounts.
    const fetchUsers = async () => {
      // Step 1: Check if we have the user info needed for an authorized call.
      if (!userInfo || !userInfo.token) {
        setError("You are not logged in. Redirecting...");
        setLoading(false);
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      if (!userInfo.isAdmin) {
        setError("Access Denied: You must be an admin to view this page.");
        setLoading(false);
        return;
      }

      try {
        console.log('Attempting to fetch users with token...');
        const response = await fetch(`/api/users`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        // Step 2: Check if the network response is okay (e.g., status 200).
        if (!response.ok) {
          // If we get an error (like 401 Unauthorized, 404 Not Found, 500 Server Error)
          // we try to get the error message text from the backend.
          const errorText = await response.text();
          console.error('Failed to fetch users. Status:', response.status, 'Response:', errorText);
          throw new Error(`Server responded with status ${response.status}: ${errorText || 'No error message'}`);
        }

        // Step 3: If the response is okay, parse the JSON data.
        const data = await response.json();
        console.log('Successfully fetched users:', data);
        setUsers(data);

      } catch (err) {
        console.error('An error occurred during the fetch operation:', err);
        // This will catch network errors or errors from the 'throw' statement above.
        setError(err.message);
      } finally {
        // This will always run, after the try or catch block.
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userInfo, navigate]);

  const deleteHandler = (id) => {
    alert(`Delete functionality for user ${id} is not yet implemented.`);
  };
  
  // --- Render Logic ---
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
              {/* Added Phone & Address Headers */}
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
                {/* Display Phone & Address Data */}
                <td className="py-3 px-4">{user.phone || 'N/A'}</td>
                <td className="py-3 px-4">{user.shippingAddress ? `${user.shippingAddress.address}, ${user.shippingAddress.city}` : 'N/A'}</td>
                <td className="py-3 px-4 text-center">
                  {user.isAdmin ? (
                    <ShieldCheck color="green" className="inline-block" />
                  ) : (
                    <ShieldX color="red" className="inline-block" />
                  )}
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