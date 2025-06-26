import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API_URL from '../apiConfig'; // Using your API config
import { useAuth } from '../context/AuthContext'; // Using your custom auth context

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not fetch user');
        
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone || '');
        setIsAdmin(data.isAdmin);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, userInfo.token]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setUpdateSuccess(false);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ name, email, phone, isAdmin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update user');
      
      setUpdateSuccess(true);
      setTimeout(() => navigate('/admin/userlist'), 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading user details...</p>;
  
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Link to="/admin/userlist" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mb-4 inline-block">
        Go Back
      </Link>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit User</h1>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {updateSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">User updated successfully! Redirecting...</div>}

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Name</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Phone</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="mb-6 flex items-center">
            <input className="mr-2 leading-tight" id="isAdmin" type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
            <label className="text-gray-700 text-sm font-bold" htmlFor="isAdmin">Is Admin</label>
          </div>
          <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
            Update User
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserEditScreen;
