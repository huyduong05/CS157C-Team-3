import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5001/cart")
      .then((res) => res.json())
      .then(setCartItems)
      .catch((err) => console.error("Failed to fetch cart items:", err));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5001/cart/${id}`, {
      method: "DELETE",
    });
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const handleUpdateQty = async (id, newQty) => {
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

  return (
    <div className="min-h-screen bg-[#f6eae2] px-8 py-12">
      <div className="flex justify-between mb-6">
        <button
          onClick={() => navigate("/productlisting")}
          className="text-sm underline text-gray-700 flex items-center"
        >
          ← Continue Shopping
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-black p-4 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold text-lg mb-1">{item.name}</h2>
                <p className="text-gray-800">Price: ${item.price}</p>
                <p className="text-gray-800">Site: {item.site}</p>
                <div className="flex space-x-3 mt-2 text-sm text-gray-700">
                  <button className="hover:underline">Edit</button>
                  <button className="hover:underline">Move to Wishlist</button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    item.quantity > 1 &&
                    handleUpdateQty(item._id, item.quantity - 1)
                  }
                  className="border px-2 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    handleUpdateQty(item._id, item.quantity + 1)
                  }
                  className="border px-2 rounded"
                >
                  +
                </button>
              </div>
            </div>
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