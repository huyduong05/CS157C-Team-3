import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authFetch from "../authFetch";
import ProductCard from '../components/ProductCard';

function Profile() {
  const navigate = useNavigate();
  const storedUsername = localStorage.getItem('username');
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5001/user/${storedUsername}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setFormData({ username: data.username, email: data.email, password: '' });
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

  useEffect(() => {
    authFetch("http://localhost:5001/recs")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched recs:", data);
        setRecs(data.recs || []);
      })
      .catch((err) => console.error("Failed to authFetch past recommendations:", err));
  }, []);

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
      const updatePayload = {
        username: formData.username,
        email: formData.email
      };
      if (formData.password) {
        updatePayload.password = formData.password;
      }

      const res = await fetch(`http://localhost:5001/user/${storedUsername}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        localStorage.setItem('username', data.username);
        setEditMode(false);
        setFormData(prev => ({ ...prev, password: '' }));
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
    <div className="min-h-screen flex flex-col items-center pt-20">
      <h1 className="text-4xl font-bold mb-4">Your Profile</h1>
      <div className="bg-neutral-50 p-6 rounded-lg border border-gray-200 shadow-2xl max-w-md w-full">
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
            <input
              type="password"
              name="password"
              placeholder="New password (optional)"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded mb-2"
            />
          </>
        ) : (
          <>
            <p className="text-gray-700">Name: {user.username}</p>
            <p className="text-gray-700 mt-2">Email: {user.email}</p>
            <p className="text-gray-700 mt-2">Password: ••••••••</p>
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
                onClick={() => {
                  setEditMode(false);
                  setFormData(prev => ({ ...prev, password: '' }));
                }}
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
      <h1 className="my-8 text-4xl font-bold mb-4">Recommended Products For You</h1>
      <div className="pb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {recs.map((item) => (
          <ProductCard
            key={item._id}
            product={item}
            actions={{ addToCart: true, addToWishlist: true }}
          />
        ))}
      </div>
    </div>
  );
}

export default Profile;
