import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const storedUsername = localStorage.getItem('username');
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5001/user/${storedUsername}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setFormData({ username: data.username, email: data.email });
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    if (storedUsername) {
      fetchUser();
    }
  }, [storedUsername]);

  const handleLogout = () => {
    localStorage.removeItem('username'); 
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setError('');
    try {
      const res = await fetch(`http://localhost:5001/user/${storedUsername}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('username', data.username); // update localStorage
        setEditMode(false);
      } else {
        setError(data.error || 'Update failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  if (!user) {
    return <div className="text-center mt-20 text-gray-600">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f6eae2] flex flex-col items-center pt-20">
      <h1 className="text-4xl font-bold mb-4">Your Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
        {editMode ? (
          <>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded mb-2"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded mb-2"
            />
          </>
        ) : (
          <>
            <p className="text-gray-700">Name: {user.username}</p>
            <p className="text-gray-700 mt-2">Email: {user.email}</p>
          </>
        )}
        <p className="text-gray-700 mt-2">Member since: {user.created_at}</p>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <div className="mt-6 flex gap-3">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Edit Profile
            </button>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-auto"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
