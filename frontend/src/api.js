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