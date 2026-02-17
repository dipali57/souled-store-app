import { X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: Props) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-96 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

        {/* User Info - Only if logged in */}
        {user && (
          <div className="p-5 border-b bg-gray-50">
            <p className="font-semibold">Welcome, {user.name}!</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            {user.role === "admin" && (
              <span className="inline-block mt-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                Admin
              </span>
            )}

             <button 
                onClick={handleLogout}
                className="text-left text-red-600 hover:text-red-800 py-2"
              >
                Logout
              </button>
          </div>
        )}

        <div className="flex flex-col p-5 gap-4 text-gray-700 font-medium">

          <Link to="/" onClick={onClose} className="hover:text-red-600 py-2">Home</Link>
          <Link to="/products" onClick={onClose} className="hover:text-red-600 py-2">All Products</Link>
          
          <div className="pl-4 space-y-2">
            <Link to="/products?category=men" onClick={onClose} className="block hover:text-red-600 py-1">Men</Link>
            <Link to="/products?category=women" onClick={onClose} className="block hover:text-red-600 py-1">Women</Link>
          </div>

          <Link to="/cart" onClick={onClose} className="hover:text-red-600 py-2">Shopping Cart</Link>

          <hr className="my-2" />

          {/* AUTHENTICATED USER LINKS - Only visible when logged in */}
          {user ? (
            <>
              <Link to="/Products" onClick={onClose} className="hover:text-red-600 py-2">Dashboard</Link>
              <Link to="/profile" onClick={onClose} className="hover:text-red-600 py-2">My Profile</Link>
              <Link to="/orders" onClick={onClose} className="hover:text-red-600 py-2">My Orders</Link>
              <Link to="/wishlist" onClick={onClose} className="hover:text-red-600 py-2">Wishlist</Link>
              
              {/* Admin Link - Only for admins */}
              {user.role === "admin" && (
                <>
                  <hr className="my-2" />
                  <Link to="/admin" onClick={onClose} className="text-red-600 font-semibold py-2">Admin Dashboard</Link>
                </>
              )}
              
              <hr className="my-2" />
              <button 
                onClick={handleLogout}
                className="text-left text-red-600 hover:text-red-800 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            /* GUEST LINKS - Only visible when NOT logged in */
            <>
              <Link 
                to="/login" 
                onClick={onClose}
                className="bg-red-600 text-white px-4 py-3 rounded text-center hover:bg-red-700 transition"
              >
                Login / Register
              </Link>
            </>
          )}

          <hr className="my-2" />
          <Link to="/contact" onClick={onClose} className="hover:text-red-600 py-2">Contact Us</Link>
          <Link to="/about" onClick={onClose} className="hover:text-red-600 py-2">About Us</Link>
          <Link to="/faq" onClick={onClose} className="hover:text-red-600 py-2">FAQ</Link>
        </div>
      </div>
    </>
  );
};