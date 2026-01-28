// import { Link } from "react-router-dom";

// function Navbar() {
//   return (
//     <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
//       <h1 className="text-xl font-bold">Smart Drive Alert</h1>

//       <div className="space-x-6">
//         <a href="#features" className="hover:text-green-400">Features</a>
//         <a href="#about" className="hover:text-green-400">About</a>
//         <Link to="/login" className="bg-green-500 px-4 py-2 rounded hover:bg-green-600">
//           Login
//         </Link>
//         <Link to="/signup" className="border border-green-500 px-4 py-2 rounded hover:bg-green-500">
//           Sign Up
//         </Link>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

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
        <Link to="/signup" className="border px-4 py-1 rounded border-green-600 text-green-600">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
