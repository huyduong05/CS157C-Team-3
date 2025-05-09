import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import authFetch from "../authFetch";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    authFetch("http://localhost:5001/cart") //changed to localhost 5000
      .then((res) => res.json())
      .then(setCartItems)
      .catch((err) => console.error("Failed to fetch cart items:", err));
  }, []);

  const handleCheckout = async () => {
    try {
      const res = await authFetch("http://localhost:5001/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: "include",  // for adding auth down the road
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || "Checkout failed");
      }

      const data = await res.json();     // { order_id, items_moved }
      alert(`Order placed! ID: ${data.order_id}`);

      // Clear the cart UI if request success
      setCartItems([]);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    const res = await authFetch(`http://localhost:5001/cart/${id}`, { 
      method: "DELETE",
    });
  
    //added alerts to communicate to user if delete successful or not
    if (res.ok) {
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      alert("Product Deleted!");
    } else {
      alert("Failed to delete");
    }
  };

  const handleUpdateQty = async (id, newQty) => {
    await fetch(`http://localhost:5001/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQty }),
    });
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item,  quantity: newQty } : item
      )
    );
  };

  const handleMoveToWishlist = async (item) => {
    // Send POST to wishlist
    await fetch("http://localhost:5001/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: item.title,
        price: item.price,
        site: item.site,
      }),
    });
  
    // Then remove from cart
    await handleDelete(item._id);
  };

  return (
    <div className="min-h-screen px-8 py-12">
      <div className="flex justify-between mb-6">
        <button
          onClick={() => navigate("/")} //switched to navigate back to home
          className="text-sm underline text-gray-700 flex items-center"
        >
          ← Continue Shopping
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <ProductCard product = {item} actions ={ { delete:true} } onDelete={handleDelete}/>
          ))}
        </div>

        <div className="bg-white border border-black p-6 rounded h-fit">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <p className="mb-2">
            Total Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </p>
          <p className="mb-4">
            Total Price: $
            {cartItems
              .reduce(
                (sum, item) => sum + item.quantity * parseFloat(item.price),
                0
              )
              .toFixed(2)}
          </p>
          <Link
            onClick={handleCheckout}
            to="/checkout"
            className="bg-red-600 text-white px-4 py-2 rounded block text-center"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;