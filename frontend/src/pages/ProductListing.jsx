import { useEffect, useState } from "react";

function ProductListing() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Temporary data fetch simulation
    setProducts([
      { _id: 1, title: "Sample Product 1", price: "$29.99", site: "https://example.com" },
      { _id: 2, title: "Sample Product 2", price: "$49.99", site: "https://example.com" },
    ]);
  }, []);

  return (
    <div className="page-content">
      <h1 className="text-3xl font-bold mb-6">Product Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
            <p className="text-gray-700 mb-1">Price: {p.price}</p>
            <a
              href={p.site}
              className="text-blue-600 underline"
              target="_blank"
              rel="noreferrer"
            >
              View Product
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductListing;