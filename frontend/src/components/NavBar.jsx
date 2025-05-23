import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUserCircle, FaHeart, FaShoppingCart, FaHome, FaClock } from "react-icons/fa";





function Navbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    console.log("Submitting Queries")
    e.preventDefault(); // prevent page reload
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav className="bg-white py-4 px-6 flex justify-between items-center">
      <Link to="/home" className="text-2xl font-bold text-red-600">Shopkeeper</Link>

      <div className="flex-1 flex justify-center">

        <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto flex">
          <FaSearch className="absolute left-4 top-2.5 text-gray-500 text-xl" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-500 focus:outline-none focus:border-black"
          />
          <button type="submit" className="mx-1 px-2 py-2 bg-red-600 hover:bg-red-500 text-white rounded-3xl">Search</button>
      </form>
      </div>

      <div className="flex items-center space-x-4 text-black text-lg">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive
              ? "flex items-center space-x-1 font-bold underline"
              : "flex items-center space-x-1"
          }
        >
          <FaHome />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            isActive
              ? "flex items-center space-x-1 font-bold underline"
              : "flex items-center space-x-1"
          }
        >
          <FaHeart />
          <span>Wishlist</span>
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive
              ? "flex items-center space-x-1 font-bold underline"
              : "flex items-center space-x-1"
          }
        >
          <FaShoppingCart />
          <span>Cart</span>
        </NavLink>
        
        <NavLink 
          to="/checkout"
          className={({ isActive }) =>
          isActive
            ? "flex items-center space-x-1 font-bold underline"
            : "flex items-center space-x-1"
          }>
          <FaClock />
          <span>Order History</span>
        </NavLink>

        <Link to="/profile">
          <FaUserCircle className="text-4xl text-gray-700 cursor-pointer" />
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;
