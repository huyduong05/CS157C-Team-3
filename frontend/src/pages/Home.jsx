import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import logo from '../assets/shopkeeper.svg'

function Home() {

  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch("http://localhost:5001/random") // using absolute route for now, need to reconfigure with proxies later
      .then(res => res.json())
      .then(data => {
        console.log("Random products:", data);
        setProducts(data);
      });
  }, []);

  return (
    <div className="text-center py-5 px-4">
      <div className="py-10">
        <h1 className="text-7xl font-bold text-red-600 flex items-center space-x-4 justify-center"><img src={logo} alt="Shopkeeper Logo" className="h-30 w-25"/>Shopkeeper</h1>
        <h2 className="text-3xl font-bold mb-2">Finding Best Products Now</h2>
        <p className="text-xl text-gray-700">Start shopping...</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {products.map((product) => (
          <ProductCard product = {product} actions = {{addToCart: true, addToWishlist: true}}/>
        ))}
      </div>
    </div>
  );
}

export default Home;