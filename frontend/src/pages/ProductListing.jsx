import { useEffect, useState } from "react";
import { fetchProducts } from '../api';

function ProductListing() {
    const [prod, setProd] = useState([]); //state to store products to display

    useEffect(() => {
      fetchProducts().then(setProd)
    }, []);

    

    return (
      <div className="min-h-screen ">
        <main className="flex flex-col space-y-6 items-center pt-44 pb-10">
          <h1 className="text-6xl text-red">
            ProductListing
          </h1>
          <ul>
            {prod.map(p => (
              <li key={p._id}>
                {p.site}: ${p.price} - {p.rating}
              </li>
            ))}
          </ul>
        </main>
      </div>
    );
  }

  export default ProductListing;