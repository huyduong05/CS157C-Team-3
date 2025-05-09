import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import authFetch from "../authFetch";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  const authFetchWishlist = async () => {
    try {
      const res = await authFetch("http://localhost:5001/wishlist");
      const data = await res.json();
      setWishlist(data);
    } catch (err) {
      console.error("Failed to authFetch wishlist:", err);
    }
  };

  const removeItem = async (id) => {
    try {
      const res = await authFetch(`http://localhost:5001/wishlist/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setWishlist((prev) => prev.filter((item) => item._id !== id));
        alert("Item removed from Wishlist!");
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const moveToCart = async (item) => {
    try {
      // Add to cart
      await authFetch("http://localhost:5001/cart", {
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
  /*
  useEffect(() => {
    authFetchWishlist();
  }, []);
  */
  useEffect(() => {
    authFetch("http://localhost:5001/wishlist") //changed to localhost 5000
      .then((res) => res.json())
      .then(setWishlist)
      .catch((err) => console.error("Failed to authFetch wishlist items: ", err));
  }, []);

  return (
    <div className="min-h-screen py-16 px-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-red-700">
        Your Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {wishlist.map((item) => (
            <ProductCard product = {item} actions = { {delete: true, addToCart:true}} onDelete={removeItem}/>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
