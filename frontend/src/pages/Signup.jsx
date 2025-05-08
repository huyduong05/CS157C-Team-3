import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { email, username, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://localhost:5001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#f6eae2] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#c4a79a] to-[#f6eae2] z-10" />

      <div className="flex flex-1 z-20">
        {/* Left Panel */}
        <div className="w-1/2 flex items-center justify-center">
          <h1 className="text-[#b31312] text-6xl font-extrabold">Shopkeeper</h1>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex justify-center items-center">
          <div className="bg-white p-10 rounded-lg shadow-md w-[350px]">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-[#432818] underline mb-4 hover:text-[#2c1a11]"
            >
              Go to Log In
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Sign Up</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-[#432818] text-white py-2 rounded hover:bg-[#2c1a11] transition"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
