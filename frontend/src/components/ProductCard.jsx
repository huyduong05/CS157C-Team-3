import React from 'react';

const ProductCard = ({ product }) => {
  
  const addToCart = () => {
    fetch('http://localhost:5000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: product.title,
            price: `${parseFloat(product.price?.toString().replace(/[^0-9.]/g, ''))}`,
            quantity: 1, // for now just add 1 at a time
            site: product.from
        })
    })
        .then(res => res.json())
        .then(data => {
            alert('Added to your Cart!');
        })
        .catch(err => {
            console.error('Error adding to cart:', err);
            alert('Failed to add to cart.');
        });
  }

  return (
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
        {product.price
          ? `$${parseFloat(product.price?.toString().replace(/[^0-9.]/g, ''))}`
          : 'Price unavailable'}
      </p>
      {/*
      {product.rating && (
        <p className="text-yellow-500">⭐ {product.rating}</p>
      )}
      */}
      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 text-blue-600 underline"
      >
        View Product
      </a>
      <button
        onClick={addToCart}
        className='mt-2 px-4 py-2 bg-cyan-700 text-white rounded'>
        Add To Cart
      </button>
    </div>
  );
};

export default ProductCard;
