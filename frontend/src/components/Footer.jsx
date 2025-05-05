import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-[#f6eae2] to-[#c4a79a] py-4 flex justify-end px-6 space-x-6 text-black text-lg">
      <Link to="/about" className="hover:underline">About Us</Link>
      <Link to="/contact" className="hover:underline">Contact</Link>
    </footer>
  );
}

export default Footer;
