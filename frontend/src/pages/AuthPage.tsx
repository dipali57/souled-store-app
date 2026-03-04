import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = location.pathname === "/login";

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[500px] shadow-lg mt-6 mb-12">
        {/* Title */}
        <div className="text-center pt-6 text-lg font-semibold">
          {isLogin ? "Login with The Souled Store" : "Register with The Souled Store"}
        </div>

        <div className="px-6 py-6">
          {/* Tabs */}
          <div className="flex">
            <button
              onClick={() => navigate("/login")}
              className={`w-1/2 py-3 font-semibold ${
                isLogin
                  ? "bg-teal-700 text-white"
                  : "bg-white text-gray-700 border"
              }`}
            >
              LOGIN
            </button>

            <button
              onClick={() => navigate("/register")}
              className={`w-1/2 py-3 font-semibold ${
                !isLogin
                  ? "bg-teal-700 text-white"
                  : "bg-white text-gray-700 border"
              }`}
            >
              REGISTER
            </button>
          </div>

          <div className="p-8 border mt-6 bg-gray-100 border-gray-300 rounded">
            <div className="w-full">
              <Outlet />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
