import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { AuthPage } from "../pages/AuthPage";
import { AdminLayout } from "../layout/AdminLayout";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoutes";
import AdminDashboard from "../pages/admin/AdminDashboard";
import { Products } from "../pages/products/Products";
import { Cart } from "../pages/cart/Cart";
import { AdminProducts } from "../pages/admin/AdminProducts";
import { ProductDetail } from "../pages/products/ProductDetail";
import { WishlistPage } from "../pages/wishlist/Wishlist";
import Orders from "../pages/orders/Orders";
import EditProfile from "../pages/user/components/EditProfile";
import UserDashboard from "../pages/user/UserDashboard";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ========== PUBLIC ROUTES - Visible to EVERYONE ========== */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route element={<AuthPage />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>
      {/* ========== PROTECTED USER ROUTES - LOGIN REQUIRED ========== */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* User Dashboard - only after login */}
        <Route path="/dashboard" element={<UserDashboard />} />
      </Route>

      {/* ========== PROTECTED ADMIN ROUTES - ADMIN ONLY ========== */}
      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        {/* 
        <Route path="/admin/products/new" element={<AdminProductForm />} />
        <Route path="/admin/products/:id" element={<AdminProductForm />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} /> */}
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
