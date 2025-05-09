import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import authFetch from "../authFetch";

function CheckoutSummary() {
  const [data, setData] = useState([]);

  useEffect(() => {
    authFetch("http://localhost:5001/orders") //changed to localhost 5000
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to authFetch past orders:", err));
  }, []);
  return (
    <div className="px-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {data.map((item) => (
            <ProductCard product = {item}/>
          ))}
        </div>

        <div className="bg-neutral-50 border border-gray-200 shadow-2xl p-6 rounded h-fit w-full">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <p className="mb-2 font-semibold">
            Total Items: {data.reduce((sum, item) => sum + item.quantity, 0)}
          </p>
          <p className="mb-4">
            Total Price: $
            {data
              .reduce(
                (sum, item) => sum + item.quantity * parseFloat(item.price),
                0
              )
              .toFixed(2)}
          </p>
        </div>
      </div>  
  );
}

export default CheckoutSummary;