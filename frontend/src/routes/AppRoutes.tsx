import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import { Home } from "../pages/Home";
import { UserDashboard } from "../pages/UserDashboard";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { AuthPage } from "../pages/AuthPage";
import { AdminLayout } from "../layout/AdminLayout";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoutes";
import AdminDashboard from "../pages/admin/AdminDashboard";
import { Products } from "../pages/user/Products";
import Cart from "../pages/user/Cart";
import { AdminProducts } from "../pages/admin/AdminProducts";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ========== PUBLIC ROUTES - Visible to EVERYONE ========== */}
      {/* These routes use MainLayout with Navbar & Sidebar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        {/* Product pages - visible to everyone */}
        <Route path="/product" element={<Products />} />

        {/* Cart - visible to everyone (guests can add to cart) */}
        <Route path="/cart" element={<Cart />} />
        <Route element={<AuthPage />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        {/* Other public pages */}
        {/* <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} /> */}
      </Route>

      {/* ========== AUTH ROUTES - NO NAVBAR, just auth form ========== */}

      {/* ========== PROTECTED USER ROUTES - LOGIN REQUIRED ========== */}
      {/* These routes also use MainLayout with Navbar & Sidebar */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        {/* User Dashboard - only after login */}
        <Route path="/dashboard" element={<UserDashboard />} />

        {/* User Profile - only after login */}
        {/* <Route path="/profile" element={<Profile />} /> */}

        {/* User Orders - only after login */}
        {/* <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} /> */}

        {/* Wishlist - only after login */}
        {/* <Route path="/wishlist" element={<Wishlist />} /> */}
      </Route>

      {/* ========== PROTECTED ADMIN ROUTES - ADMIN ONLY ========== */}
      {/* Admin routes use AdminLayout (different sidebar) */}
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

      {/* ========== 404 ROUTE ========== */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
