import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authFetch from "../authFetch";
import ProductCard from "../components/ProductCard";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    authFetch("http://localhost:5001/cart")
      .then((res) => res.json())
      .then(setCartItems)
      .catch((err) => console.error("Failed to fetch cart items:", err));
  }, []);

  const handleCheckout = async () => {
    try {
      const res = await authFetch("http://localhost:5001/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || "Checkout failed");
      }

      const data = await res.json();
      alert(`Order placed! ID: ${data.order_id}`);
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

    if (res.ok) {
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      alert("Product Deleted!");
    } else {
      alert("Failed to delete");
    }
  };

  const handleUpdateQty = async (id, newQty) => {
    if (newQty < 1) return;
    await fetch(`http://localhost:5001/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQty }),
    });

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleMoveToWishlist = async (item) => {
    await fetch("http://localhost:5001/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: item.title,
        price: item.price,
        site: item.site,
      }),
    });

    await handleDelete(item._id);
  };

  return (
    <div className="min-h-screen px-8 py-12">
      <div className="flex justify-between mb-6">
        <button
          onClick={() => navigate("/")}
          className="text-sm underline text-gray-700 flex items-center"
        >
          ← Continue Shopping
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item._id} className="space-y-2">
              <ProductCard product={item} actions={{ delete: true }} onDelete={handleDelete} />
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleUpdateQty(item._id, item.quantity - 1)
                  }
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    handleUpdateQty(item._id, item.quantity + 1)
                  }
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-neutral-50 border border-gray-200 shadow-2xl p-6 rounded h-fit w-full">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>

          <div className="space-y-3 mb-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between items-start text-sm">
                <p className="w-3/4">
                  {item.title.length > 60
                    ? item.title.slice(0, 60) + "..."
                    : item.title}
                </p>
                <p className="text-right font-medium">
                  ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <p className="mb-2">
            Total Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </p>
          <p className="mb-4 font-semibold">
            Total Price: $
            {cartItems
              .reduce((sum, item) => sum + item.quantity * parseFloat(item.price), 0)
              .toFixed(2)}
          </p>

          <Link
            onClick={handleCheckout}
            to="/checkout"
            className="bg-red-600 text-white px-4 py-2 rounded block text-center hover:bg-red-700 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCart;
