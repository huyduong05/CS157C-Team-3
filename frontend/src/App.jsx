import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import CheckoutSummary from "./pages/ShoppingCart";
import ProductListing from "./pages/ProductListing";
import Wishlist from "./pages/Wishlist";

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/checkout" element={<CheckoutSummary />} />
              <Route path="/productlisting" element={<ProductListing />} />
              <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
