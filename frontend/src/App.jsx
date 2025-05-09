import "./index.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Wishlist from "./pages/Wishlist";
import ProductListing from "./pages/ProductListing";
import ShoppingCart from "./pages/ShoppingCart";
import CheckoutSummary from "./pages/CheckoutSummary";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import AuthPage from './pages/AuthPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

function AppRoutes() {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/login', '/signup'];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {!hideNavbar && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/productlisting" element={<ProductListing />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/checkout" element={<CheckoutSummary />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
