// components/Navbar.tsx
import { Link } from "react-router-dom";
import { Menu, Search, Mic, User, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../auth/AuthContext";

export const Navbar = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useAuth();

  return (
    <div className="w-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)] sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 md:px-10 py-3">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 cursor-pointer" onClick={() => setOpenSidebar(true)} />

          <div className="hidden md:flex gap-8 font-semibold text-gray-700 text-lg">
            <Link to="/" className="font-bold hover:text-black border-b-2 border-red-500 pb-1">HOME</Link>
            <Link to="/products?category=men" className="font-bold hover:text-black">MEN</Link>
            <Link to="/products?category=women" className="font-bold hover:text-black">WOMEN</Link>
          </div>
        </div>

        {/* CENTER LOGO */}
        <Link to="/" className="flex justify-center flex-1 md:flex-none">
          <img
            alt="Souled Store Logo"
            src="/src/assets/souledstorelogo.png"
            className="w-24 md:w-32 h-10 md:h-12 object-contain"
          />
        </Link>

        {/* RIGHT */}
        <div className="flex items-center gap-4 md:gap-7">
          {/* Search Bar */}
          <div className="hidden lg:flex items-center border rounded-full px-4 py-2 w-[250px] bg-gray-50">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <Mic className="w-4 h-4 mx-2 text-gray-500" />
            <Search className="w-4 h-4 text-gray-500" />
          </div>

          {/* User Icon - Always shows, links to login if not authenticated */}
          <Link to={user ? "/dashboard" : "/login"}><User className="w-6 h-6 cursor-pointer" /></Link>
          
          {/* Wishlist - Only for logged in users */}
          {user && (<Link to="/wishlist"><Heart className="w-6 h-6 cursor-pointer hidden sm:block" /></Link>)}

          {/* Cart - Always visible */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 cursor-pointer" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">9</span>
          </Link>

          {/* Admin Link - Only for admins */}
          {user?.role === "admin" && (<Link to="/admin" className="hidden md:block text-sm bg-gray-800 text-white px-3 py-1 rounded">Admin</Link>)}
        </div>

        <Sidebar isOpen={openSidebar} onClose={() => setOpenSidebar(false)} />
      </div>
    </div>
  );
};