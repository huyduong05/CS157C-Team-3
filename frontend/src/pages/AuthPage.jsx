import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col bg-[#f6eae2] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#c4a79a] to-[#f6eae2] z-10" />

      <div className="flex flex-1 z-20">
        {/* Left Panel */}
        <div className="w-1/2 flex items-center justify-center">
          <h1 className="text-[#b31312] text-6xl font-extrabold">Shopkeeper</h1>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">Welcome!</h2>
          <p className="text-gray-600 mb-6">Please log in or sign up to continue.</p>
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={() => navigate('/login')}
              className="w-60 bg-[#432818] text-white py-3 rounded hover:bg-[#2c1a11] transition"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="w-60 bg-[#432818] text-white py-3 rounded hover:bg-[#2c1a11] transition"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate('/home')}
              className="w-60 bg-[#432818] text-white py-3 rounded hover:bg-[#2c1a11] transition"
            >
              Sign In As Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
