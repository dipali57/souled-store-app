import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Badge,
  IconButton,
  InputBase,
  Typography,
  styled,
  Tab,
  Tabs,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/souledstorelogo.png";
import {
  Search,
  FavoriteBorder,
  ShoppingCart,
  AccountCircle,
} from "@mui/icons-material";

const SearchBox = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "white",
  padding: "5px 10px",
  borderRadius: "5px",
  flexGrow: 1,
  maxWidth: "300px",
}));

const Logo = styled("img")(() => ({
  height: "50px",
}));

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("Men");

  const categoryOptions: Record<string, string[]> = {
    Men: ["T-Shirts", "Shirts", "Jeans", "Shoes"],
    Women: ["Dresses", "Tops", "Skirts", "Heels"],
    Kids: ["Onesies", "Shorts", "Sneakers", "Hoodies"],
  };

  return (
    <>
      {/* Top Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#e11b23" }}>
        <Toolbar
          sx={{
            display: "flex",
            padding: '0 !important', // Remove default padding
            minHeight: '48px !important', // Reduce toolbar height,
            justifyContent: "space-between",
            alignItems: "center",
            // minHeight: 45,
          }}
        >
          <Logo src={logo} alt="Souled Store Logo" />

          <Tabs
            value={selectedCategory}
            onChange={(_, newValue) => setSelectedCategory(newValue)}
            sx={{
              display: "flex",
              borderColor: "black",
              minHeight: '48px',
              gap: 3,
              "& .MuiButtonBase-root:not(:last-child)": {
                borderRight: "0.5px solid black",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#ffff", // Color for the underline indicator
                height: 2, // Adjust indicator thickness if needed
              },
            }}
          >
            {["Women", "Men", "Kids"].map((category) => (
              <Tab
                key={category}
                label={category}
                value={category}
                sx={{
                  color: "white", // Default text color
                  fontWeight: 900, 
                  "&.Mui-selected": {
                    background: "#ffff",
                    color: "black", // Text color when selected
                    fontWeight: 900, // Optional: make selected tab bold
                  },
                  "&:hover": {
                    color: "black", // Text color on hover
                  },
                }}
              />
            ))}
          </Tabs>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: "white", fontWeight: "bold", cursor: "pointer" }}
            >
              Track Order
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", fontWeight: "bold", cursor: "pointer" }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "white", fontWeight: "bold", cursor: "pointer" }}
            >
              Download App
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Bottom Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#ffff" }}>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 3 }}>
            {categoryOptions[selectedCategory].map((option) => (
              <Typography
                key={option}
                variant="body2"
                sx={{ color: "black", fontWeight: "bold", cursor: "pointer" }}
              >
                {option}
              </Typography>
            ))}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box>
              <Button color="secondary" component={Link} to="/products">
                Products
              </Button>
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Button color="secondary" component={Link} to="/admin">
                      Admin
                    </Button>
                  )}
                  <Button color="secondary" component={Link} to="/cart">
                    Cart
                  </Button>
                  <Button color="secondary" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="secondary" component={Link} to="/login">
                    Login
                  </Button>
                  <Button color="secondary" component={Link} to="/signup">
                    Signup
                  </Button>
                </>
              )}
            </Box>
            <SearchBox>
              <InputBase placeholder="Search for products" fullWidth />
              <Search sx={{ color: "gray", marginRight: "5px" }} />
            </SearchBox>
            <IconButton color="default">
              <FavoriteBorder />
            </IconButton>
            <IconButton color="default" onClick={() => navigate("/cart")}>
              <Badge badgeContent={2} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
            <IconButton color="default">
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
