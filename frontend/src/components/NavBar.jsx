import { NavLink, Link } from "react-router-dom";
import { FaSearch, FaUserCircle, FaHeart, FaShoppingCart, FaHome } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="bg-gradient-to-b from-[#c4a79a] to-[#f6eae2] py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-red-600">MyShop</Link>

      <div className="flex-1 flex justify-center">
        <div className="relative w-[60%]">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-full border border-gray-400 focus:outline-none"
          />
          <FaSearch className="absolute right-4 top-2.5 text-gray-500" />
        </div>
      </div>

      <div className="flex items-center space-x-4 text-black text-lg">
        <NavLink
          to="/"
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

        <Link to="/profile">
          <FaUserCircle className="text-4xl text-gray-700 cursor-pointer" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
