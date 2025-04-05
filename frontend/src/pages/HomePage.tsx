import React, { useState } from "react";
import { Container, Grid, Grid2, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [products] = useState([
    { id: 1, name: "T-Shirt", price: 20, category: "Clothing", image: "https://assets.ajio.com/medias/sys_master/root/20240716/9BOM/6696aca91d763220fac864c4/-473Wx593H-466747617-pink-MODEL.jpg" },
    { id: 2, name: "Men Loose Fit Shirt with Flap Pockets", price: 40, category: "Clothing", image: "https://assets.ajio.com/medias/sys_master/root/20240213/bxcs/65ca758716fd2c6e6af201f1/-473Wx593H-467065998-brown-MODEL.jpg" },
    { id: 3, name: "Denim shirts", price: 50, category: "Clothing", image: "https://assets.ajio.com/medias/sys_master/root/20240716/cM8e/6696aca36f60443f3151c350/-473Wx593H-466747617-blue-MODEL.jpg" },
    { id: 4, name: "T-Shirt", price: 20, category: "Clothing", image: "https://assets.ajio.com/medias/sys_master/root/20240716/9BOM/6696aca91d763220fac864c4/-473Wx593H-466747617-pink-MODEL.jpg" },
    { id: 5, name: "Loose Shirts", price: 40, category: "Clothing", image: "https://assets.ajio.com/medias/sys_master/root/20240213/bxcs/65ca758716fd2c6e6af201f1/-473Wx593H-467065998-brown-MODEL.jpg" },
    { id: 6, name: "Denim shirts", price: 50, category: "Clothing", image: "https://assets.ajio.com/medias/sys_master/root/20240716/cM8e/6696aca36f60443f3151c350/-473Wx593H-466747617-blue-MODEL.jpg" },
    { id: 7, name: "T-Shirt", price: 20, category: "Clothing", image: "https://assets.ajio.com/medias/sys_master/root/20240716/9BOM/6696aca91d763220fac864c4/-473Wx593H-466747617-pink-MODEL.jpg" },
    { id: 8, name: "Loose Shirts", price: 40, category: "Clothing", image: "https://assets.ajio.com/medias/sys_master/root/20240213/bxcs/65ca758716fd2c6e6af201f1/-473Wx593H-467065998-brown-MODEL.jpg" },
    { id: 9, name: "Denim shirts", price: 50, category: "Clothing", image: "https://assets.ajio.com/medias/sys_master/root/20240716/cM8e/6696aca36f60443f3151c350/-473Wx593H-466747617-blue-MODEL.jpg" },
    { id: 10, name: "T-Shirt", price: 20, category: "Clothing", image: "https://assets.ajio.com/medias/sys_master/root/20240716/9BOM/6696aca91d763220fac864c4/-473Wx593H-466747617-pink-MODEL.jpg" },
    { id: 11, name: "Loose Shirts", price: 40, category: "Clothing", image: "https://assets.ajio.com/medias/sys_master/root/20240213/bxcs/65ca758716fd2c6e6af201f1/-473Wx593H-467065998-brown-MODEL.jpg" },
    { id: 12, name: "Denim shirts", price: 50, category: "Clothing", image: "https://assets.ajio.com/medias/sys_master/root/20240716/cM8e/6696aca36f60443f3151c350/-473Wx593H-466747617-blue-MODEL.jpg" },
  ]);

  const addToCart = (id: number) => {
    console.log(`Added product ${id} to cart`);
    navigate('/cart');
  };

  return (
    <>
      <Navbar />
      
      <Container sx={{ marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          Featured Products
        </Typography>
        <Grid2 container spacing={3}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <ProductCard product={product} onAddToCart={addToCart} />
            </Grid>
          ))}
        </Grid2>
      </Container>
      <Footer />
    </>
  );
};

export default HomePage;
