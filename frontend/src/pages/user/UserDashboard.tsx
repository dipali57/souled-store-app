import React, { useState } from "react";
import EditProfile from "./components/EditProfile";
import GiftVouchers from "./components/GiftVouchers";
import Orders from "../orders/Orders";
import {
  useGetCurrentUserQuery,
  useDeleteAccountMutation,
} from "./redux/user.api";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

type TabType = "profile" | "orders" | "vouchers" | "faqs";

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const { data: user, isLoading, error } = useGetCurrentUserQuery();
  const [deleteAccount] = useDeleteAccountMutation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    4;
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      try {
        await deleteAccount().unwrap();
        handleLogout();
      } catch (error) {
        console.error("Failed to delete account:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading user data. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-gray-200 mb-5 flex-row justify-center py-5 border border-gray-300 rounded-xs">
              <h1 className="text-x font-bold text-gray-900 pl-3">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600 mt-1 pl-3 text-sm">{user?.email}</p>
            </div>
            <div className="bg-white rounded-xs shadow-sm border border-gray-300 overflow-hidden">
              {/* Sidebar Menu */}
              <nav className="divide-y divide-gray-200">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                    activeTab === "profile"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  Profile
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                    activeTab === "orders"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  Orders
                </button>

                <button
                  onClick={() => setActiveTab("vouchers")}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                    activeTab === "vouchers"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  Gift Vouchers
                </button>

                <button
                  onClick={() => setActiveTab("faqs")}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                    activeTab === "faqs"
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  FAQs
                </button>
              </nav>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={handleDeleteAccount}
                  className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-xs hover:bg-red-500 hover:text-white transition-colors text-sm font-medium"
                >
                  DELETE MY ACCOUNT
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-red-600 border border-red-300 rounded-xs hover:bg-red-500 hover:text-white transition-colors text-sm font-medium"
                >
                  LOGOUT
                </button>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            <div className="">
              {activeTab === "profile" && <EditProfile user={user} />}
              {activeTab === "orders" && <Orders />}
              {activeTab === "vouchers" && <GiftVouchers />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
