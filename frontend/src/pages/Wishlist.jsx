import { useEffect, useState } from "react";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("http://localhost:5001/wishlist");
      const data = await res.json();
      setWishlist(data);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  const removeItem = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/wishlist/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setWishlist((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const moveToCart = async (item) => {
    try {
      // Add to cart
      await fetch("http://localhost:5001/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name || item.title,
          price: item.price,
          quantity: 1,
          site: item.site,
        }),
      });
      // Then remove from wishlist
      await removeItem(item._id);
    } catch (err) {
      console.error("Failed to move item to cart:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-[#f6eae2] py-16 px-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-red-700">
        Your Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-black rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-semibold mb-2">{item.title || item.name}</h2>
              <p className="text-gray-700 mb-1">
                <strong>Price:</strong> {item.price}
              </p>
              <a
                href={item.site}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-words"
              >
                View Product
              </a>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => moveToCart(item)}
                  className="text-blue-700 hover:underline"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
