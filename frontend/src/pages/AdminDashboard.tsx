import { useState } from "react";
import { TextField, Button, Container, Typography, Grid2 } from "@mui/material";
import axios from "axios";
import { ADD_PRODUCT_URL } from "../api/constants/endpoints";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imgurl, setImgUrl] = useState("");
  const [category, setCategory] = useState("");

  const handleAddProduct = async () => {
    try {
      await axios.post(ADD_PRODUCT_URL, { name, description, price,stock,imgurl, category });
      alert("Product added successfully");
      navigate('/products')
    } catch (error) {
      alert("Failed to add product");
    }
  };

  return (
    <Container maxWidth="sm">
      <Grid2
        container
        direction="column"
        sx={{
          justifyContent: "center",
          padding: "40px 50px",
          margin: "30px 10px",
          border: "1px solid black",
          borderRadius: "8px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography variant="h4">Admin Dashboard</Typography>
        <TextField
          label="Product Name"
          fullWidth
          margin="normal"
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Price"
          fullWidth
          margin="normal"
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          label="Stock"
          fullWidth
          margin="normal"
          onChange={(e) => setStock(e.target.value)}
        />
        <TextField
          label="Image Url"
          fullWidth
          margin="normal"
          onChange={(e) => setImgUrl(e.target.value)}
        />
        <TextField
          label="Category"
          fullWidth
          margin="normal"
          onChange={(e) => setCategory(e.target.value)}
        />
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginTop: "10px" }}
          fullWidth
          onClick={handleAddProduct}
        >
          Add Product
        </Button>
      </Grid2>
    </Container>
  );
};

export default AdminDashboard;
