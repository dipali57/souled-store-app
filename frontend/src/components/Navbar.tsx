import { Link, useLocation } from "react-router-dom";
import { Menu, Search, Heart, ShoppingCart, CircleUser } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../auth/AuthContext";
import { useGetUserCartQuery } from "../pages/cart/redux/cart.api";
import { useWishlist } from "../pages/wishlist/hooks/useWishlist";

export const Navbar = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const { user } = useAuth();
  const { data } = useGetUserCartQuery(undefined, {skip: !user});
  const { wishlistCount } = useWishlist();
  const cartCount = data?.totalItems ?? 0;
  const { pathname, search } = useLocation();
  const isActive = (path: string) => {
    const currentPath = pathname + search;
    return path === "/" ? pathname === "/" : currentPath === path;
  };

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "MEN", path: "/products?category=men" },
    { name: "WOMEN", path: "/products?category=women" }
  ];

  const iconLinks = [
    {
      name: "profile",
      path: user
      ? user.role === "admin"
        ? "/admin/dashboard"
        : "/dashboard"
      : "/login",
      icon: CircleUser,
      show: true,
      count: 0,
    },
    {
      name: "wishlist",
      path: "/wishlist",
      icon: Heart,
      show: !!user,
      count: wishlistCount,
    },
    {
      name: "cart",
      path: "/cart",
      icon: ShoppingCart,
      show: true,
      count: cartCount,
    },
  ];

  return (
    <div className="w-full bg-white shadow-[0_4px_10px_rgba(0,0,0,0.08)] sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 md:px-10 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Menu
            className="w-6 h-6 cursor-pointer"
            onClick={() => setOpenSidebar(true)}
          />

          <div className="hidden md:flex gap-8 font-semibold text-base pl-4">
            {navLinks.map(({ name, path }) => {
              const active = isActive(path);
              return (
                <Link
                  key={name}
                  to={path}
                  className={`relative font-medium py-2 ${
                    active ? "text-red-600" : "text-gray-700 hover:text-red-600"
                  }`}
                >
                  {name}
                  {/* Line indicator */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-red-600 ${
                      active ? "w-10" : "w-0 hover:w-10"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Logo */}
        <Link to="/" className="flex justify-center flex-1 md:flex-none">
          <img
            alt="Souled Store Logo"
            src="/src/assets/souledstorelogo.png"
            className="w-24 md:w-32 h-10 md:h-12 object-contain"
          />
        </Link>

        {/* Right Section */}
        <div className="flex items-center">
          {/* Search Bar */}
          <div className="hidden lg:flex items-center border rounded-full px-4 py-2 w-[280px] bg-gray-50">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <Search className="w-4 h-4 text-gray-500 bg-white" />
          </div>

          <Search className="w-5 h-5 lg:hidden cursor-pointer text-gray-700 hover:text-red-600" />

          {/* Icons */}
          {iconLinks.map(({ name, path, icon: Icon, show, count }) => {
            if (!show) return null;
            const active = isActive(path);
            return (
              <Link key={name} to={path} className="relative px-3 pb-3">
                <Icon
                  className={`cursor-pointer ${active ? "text-red-600" : "text-gray-700 hover:text-red-600"}`}
                />
                {count > 0 && (
                  <span className="absolute -top-2 -right-0.5 bg-red-600 text-white text-[10px] px-1 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                    {count}
                  </span>
                )}
                {/* Line indicator */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-red-600 ${
                    active ? "w-10" : "w-0 hover:w-10"
                  }`}
                />
              </Link>
            );
          })}

          {/* Admin Link */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`hidden md:block text-sm px-3 py-1.5 rounded-md ${
                isActive("/admin")
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-white hover:bg-red-600"
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        <Sidebar isOpen={openSidebar} onClose={() => setOpenSidebar(false)} />
      </div>
    </div>
  );
};
