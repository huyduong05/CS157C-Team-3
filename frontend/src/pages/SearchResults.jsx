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
  const [sortOrder, setSortOrder] = useState("relevance");

  const handleSort = (value) => {
    setSortOrder(value);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5001/search?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        let fetchedResults = data.products || [];

        const getNumericPrice = (price) => {
          if (typeof price === "string") {
            
            const cleaned = price.replace(/[^\d.]/g, '');
            const numeric = parseFloat(cleaned);
            return isNaN(numeric) ? 0 : numeric;
          }
          return typeof price === "number" ? price : 0;
        };
        
        
        if (sortOrder === "lowToHigh") {
          fetchedResults.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
        } else if (sortOrder === "highToLow") {
          fetchedResults.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
        } else if (sortOrder === "aToZ") {
          fetchedResults.sort((a, b) =>
            a.title?.localeCompare(b.title || "", undefined, { sensitivity: 'base' })
          );
        } else if (sortOrder === "zToA") {
          fetchedResults.sort((a, b) =>
            b.title?.localeCompare(a.title || "", undefined, { sensitivity: 'base' })
          );
        } 

        setResults(fetchedResults);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching search results:', err);
        setLoading(false);
      });
  }, [query, sortOrder]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="p-6">
      {results.length === 0 ? (
        <p>No products found for "{query}"</p>
      ) : (
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <p className="text-lg font-medium">Search results for "{query}"</p>
            <select
              className="border border-gray-300 rounded px-2 py-1 text-sm"
              onChange={(e) => handleSort(e.target.value)}
              value={sortOrder}
            >
              <option value="relevance">Featured</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
              <option value="aToZ">Title: A to Z</option>
              <option value="zToA">Title: Z to A</option>
              
            </select>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {results.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                actions={{ addToCart: true, addToWishlist: true }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
