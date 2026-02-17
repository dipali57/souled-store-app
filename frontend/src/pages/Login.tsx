import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email,password)
      navigate("/Products");
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(
        error.message || "Failed to login. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-100 text-red-600 p-3 mb-4 text-sm rounded">
          {error}
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full border p-3 mb-4 bg-white"
            placeholder="Email address"
          />

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full border p-3 mb-4 bg-white"
            placeholder="Password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 rounded-md font-semibold"
          >
            {loading ? "Signing in..." : "LOGIN"}
          </button>

          <div className="text-center mt-4 text-sm">
            New User?{" "}
            {/* <span
              className="text-red-500 cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Create Account
            </span> */}
            <Link
              to="/register"
              className="font-medium text-red-600 hover:text-red-500"
            >
              Register here
            </Link>
          </div>
        </div>
      </form>
    </>
  );
};
