import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = location.pathname === "/login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[500px] shadow-lg mt-6">
        {/* Title */}
        <div className="text-center pt-6 text-xl font-semibold">
          Login with The Souled Store
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

          {/* Content box */}
          {/* <div className="p-8 border mt-6 bg-gray-100 border-gray-300 rounded min-h-[420px] flex flex-col justify-center">
            <Outlet />
          </div> */}
          <div className="p-8 border mt-6 bg-gray-100 border-gray-300 rounded min-h-[420px]">
            <div className="w-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
