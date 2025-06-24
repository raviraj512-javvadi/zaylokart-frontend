import React, { useState, useEffect, useCallback } from 'react';
// The 'lucide-react' library provides the icons used in the UI.
import { ShieldCheck, ShieldX, Trash2 } from 'lucide-react';

// --- Mock Configuration & Data ---
// To make this component runnable on its own, we define mock versions
// of the external dependencies it originally had.

/**
 * Mock API URL. In a real application, this would be in a configuration file.
 */
const API_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Mock implementation of the 'useAuth' hook.
 * This simulates the authentication context, providing user information.
 * @returns {{userInfo: {token: string, isAdmin: boolean}}}
 */
const useAuth = () => ({
  // We simulate a user who is logged in and is an administrator.
  userInfo: {
    token: 'fake-jwt-token-for-preview',
    isAdmin: true,
  },
});


// --- Main Component: UserListScreen ---
// This component displays a list of users for an admin panel.

const UserListScreen = () => {
  // --- State Management ---
  const [users, setUsers] = useState([]);      // Holds the list of users fetched from the API.
  const [loading, setLoading] = useState(true); // Tracks whether the data is being loaded.
  const [error, setError] = useState(null);      // Stores any error messages from the API call.

  // Get user info from our mock authentication hook.
  const { userInfo } = useAuth();

  // --- Data Fetching ---
  // The fetchUsers function is wrapped in `useCallback` to memoize it.
  // This prevents it from being recreated on every render, which is important
  // because it's a dependency of the `useEffect` hook.
  const fetchUsers = useCallback(async () => {
    // We must have user info to proceed.
    if (!userInfo || !userInfo.token) {
      setError("Authentication credentials are missing.");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      // Fetch user data from the public mock API.
      const response = await fetch(`${API_URL}/users`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users. Status: ${response.status}`);
      }

      const data = await response.json();

      // Process the fetched data to match the structure our component expects.
      // We add a `_id` and a sample `isAdmin` flag.
      const processedData = data.map((user, index) => ({
        ...user,
        _id: user.id,
        isAdmin: index % 3 === 0, // Make every third user an admin for variety.
      }));

      setUsers(processedData);
      setError(null); // Clear previous errors on success.
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userInfo]); // This function depends on `userInfo`.

  // --- Effects ---
  // This `useEffect` hook runs when the component mounts or its dependencies change.
  useEffect(() => {
    // Only fetch users if the current user is an admin.
    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
    } else {
      // In a real app, a non-admin would be redirected. Here, we just log it.
      console.log("Access denied. User is not an admin.");
      setError("You do not have permission to view this page.");
      setLoading(false);
    }
  }, [userInfo, fetchUsers]); // Dependencies: runs if `userInfo` or `fetchUsers` changes.

  // --- Event Handlers ---
  /**
   * Handles deleting a user from the list.
   * @param {string | number} id - The ID of the user to delete.
   */
  const deleteHandler = (id) => {
    // In a production app, a custom modal is preferable to `window.confirm`.
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Filter out the deleted user from the state.
      setUsers(currentUsers => currentUsers.filter(user => user._id !== id));
      console.log(`User with ID: ${id} was deleted from the view.`);
      // A real application would also send a DELETE request to the API here.
    }
  };

  // --- Conditional Rendering ---
  // Shows a loading message while data is being fetched.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p className="text-lg animate-pulse">Loading Users...</p>
      </div>
    );
  }

  // Shows an error message if the API call failed.
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-red-400">
        <p className="text-lg">Error: {error}</p>
      </div>
    );
  }

  // --- JSX Output ---
  // Renders the main user table UI.
  return (
    <div className="bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 text-gray-200 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">User Management</h1>
        </div>
        <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr className="border-b-2 border-gray-700 bg-gray-700 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3 text-center">Admin</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800">
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
                    <td className="px-5 py-4 text-sm">{user._id}</td>
                    <td className="px-5 py-4 text-sm">{user.name}</td>
                    <td className="px-5 py-4 text-sm">
                      <a href={`mailto:${user.email}`} className="text-blue-400 hover:text-blue-300 transition-colors duration-300">
                        {user.email}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-sm text-center">
                      {user.isAdmin ? (
                        <ShieldCheck className="inline-block text-green-500" size={22} title="Admin User" />
                      ) : (
                        <ShieldX className="inline-block text-red-500" size={22} title="Standard User" />
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-center">
                      <div className="flex item-center justify-center">
                        {!user.isAdmin && (
                            <button
                              className="p-2 rounded-full text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                              title="Delete User"
                              onClick={() => deleteHandler(user._id)}>
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
      </div>
    </div>
  );
};

export default UserListScreen;
