import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Redirect based on user role
  useEffect(() => {
    if (user) {
      // Type assertion to tell TypeScript this is your user type
      const userWithRole = user as { role?: string };

      if (userWithRole.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Enter valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success("Login Successfull!");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Try again.";

      setServerError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex px-4 sm:px-6 lg:px-8">
      {/* SERVER ERROR */}
      <div className="max-w-md w-full">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {serverError && (
            <div className="bg-red-50 text-red-600 p-3  text-sm rounded border border-red-200">
              {serverError}
            </div>
          )}
          <div className="space-y-4">
            {/* EMAIL */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled={loading}
                onChange={handleChange}
                className="w-full border border-gray-300 text-sm py-2 px-3 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                disabled={loading}
                onChange={handleChange}
                autoComplete="off"
                data-ms-editor="false"
                className="w-full border border-gray-300 text-sm py-2 px-3 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white text-sm py-2 px-3 rounded-md font-semibold disabled:opacity-60"
            >
              {loading ? "Signing in..." : "LOGIN"}
            </button>

            <div className="text-center mt-4 text-sm">
              New User?{" "}
              <Link
                to="/register"
                className="font-medium text-red-600 hover:text-red-500"
              >
                Register here
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
