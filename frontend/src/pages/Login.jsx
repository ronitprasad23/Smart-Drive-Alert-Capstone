import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PublicNavbar from "../components/PublicNavbar";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <>
      <PublicNavbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded shadow-md w-96"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-center">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}
