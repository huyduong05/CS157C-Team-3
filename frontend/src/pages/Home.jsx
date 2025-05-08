import React, { useState, useEffect } from "react";

function Home() {

  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/random") // using absolute route for now, need to reconfigure with proxies later
      .then(res => res.json())
      .then(data => {
        console.log("Random products:", data);
        setProducts(data);
      });
  }, []);

  return (
    <div className="text-center py-24">
      <h1 className="text-4xl font-bold mb-2">Finding Best Products Now</h1>
      <p className="text-xl text-gray-700">Start shopping...</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg shadow-md p-4 flex flex-col items-center"
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-32 h-32 object-contain mb-2"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mb-2">
                No Image
              </div>
            )}
            <h2 className="text-lg font-semibold mb-1">{product.title}</h2>
            <p className="text-sm text-gray-500 mb-1">{product.from}</p>
            <p className="text-green-600 font-bold mb-1">
            {product.price ? `$${parseFloat(product.price?.toString().replace(/[^0-9.]/g, ''))}` : "Price unavailable"}
            </p>
            {/*product.rating && (
              <p className="text-yellow-500">⭐ {product.rating}</p>
            )*/}
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-blue-600 underline"
            >
              View Product
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;