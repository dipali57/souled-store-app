import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthdate: "",
    mobile: "",
    gender: "M",
  });

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    birthdate?: string;
    mobile?: string;
    gender?: string;
  }>({});

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const mobileRegex = /^[0-9]{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "radio"
          ? value === "male"
            ? "M"
            : value === "female"
              ? "F"
              : "O"
          : value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name required";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last name required";
    }

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(formData.email))
      newErrors.email = "Enter valid email";

    if (!formData.password) {
      newErrors.password = "Password required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // if (!formData.birthdate) {
    //   newErrors.birthdate = "Birthdate required";
    // }

    if (!formData.mobile) {
      newErrors.mobile = "Mobile number required";
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Enter valid 10-digit mobile number";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setLoading(true);

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
        gender: formData.gender as "M" | "F" | "O",
        //birthdate: formData.birthdate,
      });
      toast.success("Register Successfull!");
      navigate("/login");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Registration failed";
      setServerError(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SERVER ERROR */}
          {serverError && (
            <div className="bg-red-50 text-sm py-2 px-3 text-red-600 text-sm rounded border border-red-200">
              {serverError}
            </div>
          )}

          <div className="flex gap-4">
            {/* First Name */}
            <div className="flex-1">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                disabled={loading}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full text-sm border border-gray-300 py-2 px-3 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="flex-1">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                disabled={loading}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full text-sm border border-gray-300 py-2 px-3 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={loading}
              onChange={handleChange}
              placeholder="Email address"
              className="w-full text-sm border border-gray-300 py-2 px-3 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              disabled={loading}
              onChange={handleChange}
              className="w-full border border-gray-300 text-sm py-2 px-3 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
              placeholder="Confirm Password"
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

          {/* Birthdate */}
          <div>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              disabled={loading}
              onChange={handleChange}
              placeholder="Please enter your birthdate *"
              className="w-full text-sm border border-gray-300 py-2 px-3 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              (Avail 10% Birthday discount as a member)
            </p>
            {errors.birthdate && (
              <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              disabled={loading}
              onChange={handleChange}
              placeholder="+91 Mobile Number (For order status update) *"
              className="w-full text-sm border border-gray-300 py-2 px-3 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <div className="flex space-x-6">
              <p className="text-sm">Gender</p>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "M"}
                  onChange={handleChange}
                  className="text-red-500 text-sm"
                />
                <span>Male</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "F"}
                  onChange={handleChange}
                  className="text-red-500 text-sm"
                />
                <span>Female</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === "O"}
                  onChange={handleChange}
                  className="text-red-500 text-sm"
                />
                <span>Other</span>
              </label>
            </div>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </div>

          {/* REGISTER Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-white text-sm py-2 px-3 rounded font-semibold hover:bg-red-600 transition-colors disabled:opacity-60 mt-6"
          >
            {loading ? "REGISTERING..." : "REGISTER"}
          </button>

          {/* Login Link */}
          <div className="text-center mt-4">
            <span className="text-sm">
              Already a Customer?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-red-500 hover:underline font-medium"
              >
                Login
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
