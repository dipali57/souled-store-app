import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        className="w-full border p-3 mb-4 bg-white"
      />
      <input
        type="text"
        placeholder="Enter Email"
        className="w-full border p-3 mb-4 bg-white"
      />

      <input
        type="text"
        placeholder="Enter Password"
        className="w-full border p-3 mb-4 bg-white"
      />

      <button className="w-full bg-red-500 text-white py-3 rounded-md font-semibold">
        REGISTER
      </button>

      <div className="text-center mt-4 text-sm">
        Already have account?{" "}
        <span
          className="text-red-500 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </div>
    </div>
  );
};
