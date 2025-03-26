import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
//import { AuthProvider } from "./contexts/AuthContext";
// import theme from "./theme";

function App() {
  return (
    // <ThemeProvider theme={theme}>
      <>
      {/* // <ThemeProvider theme={theme}> */}
      <CssBaseline />
      {/* // <AuthProvider> */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </Router></>
     //</AuthProvider>
    // </ThemeProvider>
  );
}

export default App;
