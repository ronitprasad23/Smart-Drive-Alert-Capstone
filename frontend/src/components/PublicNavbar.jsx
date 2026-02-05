

import { Link } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
      <h1 className="text-xl font-bold text-green-600">
        Smart Drive Alert
      </h1>

      <div className="flex gap-6">
        <Link to="/" className="hover:text-green-500">Home</Link>
        <Link to="/about" className="hover:text-green-500">About</Link>
        <Link to="/login" className="text-green-600 font-semibold">Login</Link>
      </div>
    </nav>
  );
}