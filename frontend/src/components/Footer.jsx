import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full bg-red-600 py-4 flex justify-end px-6 space-x-6 text-black text-lg">
      <Link to="/about" className="text-white font-semibold hover:underline">About Us</Link>
      <Link to="/contact" className="text-white font-semibold hover:underline">Contact</Link>
    </footer>
  );
}

export default Footer;
