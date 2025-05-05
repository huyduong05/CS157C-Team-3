import axios from 'axios';

export async function fetchProducts() {
    try { 
        //calling flask backend using the proxy
        const { data } = await axios.get('/products');
        return data
    } catch (err) {
        console.error('Failed to get products:', err);
        return [];
    }
}


// get the shopping cart from MongoDB
export async function fetchCart() {
    try { 
        //calling flask backend using the proxy
        const { data } = await axios.get('/cart');
        return data
    } catch (err) {
        console.error('Failed to get shopping cart:', err);
        return [];
    }
}