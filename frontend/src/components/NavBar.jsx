import {Link, NavLink} from 'react-router-dom';

function NavBar() {

    return (
        <nav className="bg-cyan-900 border-b border-white-300 sticky top-0 z-10 flex justify-around">
            <div> NavBar</div>
            <Link className="border-cyan-800 bg-cyan-600 text-white rounded-2xl border-2 m-1 p-2" to="/">Home</Link>
            <Link className="border-cyan-800 bg-cyan-600 text-white rounded-2xl border-2 m-1 p-2" to="/checkout">Checkout Page</Link>
            <Link className="border-cyan-800 bg-cyan-600 text-white rounded-2xl border-2 m-1 p-2" to="/productlisting">Search</Link>
            <Link className="border-cyan-800 bg-cyan-600 text-white rounded-2xl border-2 m-1 p-2" to="/wishlist">Wishlist</Link>
        </nav>

    );

}

export default NavBar;