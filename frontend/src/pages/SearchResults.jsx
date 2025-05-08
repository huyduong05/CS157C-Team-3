import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from "../components/ProductCard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery().get('query') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // query backend for products
  useEffect(() => {
    fetch(`http://localhost:5001/search?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setResults(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching search results:', err);
        setLoading(false);
      });
  }, [query]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="p-6">
      {results.length === 0 ? (
        <p>No products found for "{query}"</p>
      ) : ( 
        <div className='flex flex-col'>
            <p className="mb-4 text-lg font-medium">Search results for "{query}"</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' >
            {results.map(product => (
                <ProductCard key={product._id} product={product} actions={{ addToCart: true, addToWishlist: true }} />
            ))}
            </div>
      </div>
      )}
    </div>
  );
};

export default SearchResults;
