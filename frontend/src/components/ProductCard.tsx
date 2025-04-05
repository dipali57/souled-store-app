import React from "react";
import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
  };
  onAddToCart: (id: number) => void;
}


const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart })  => {
  return (
    <Card sx={{ border: "1px solid #ddd", borderRadius: "10px", padding: "2px", textAlign: "center", maxWidth: "200px" }}>
      <CardContent>
      <CardMedia component="img" height="200" image={product.image} alt={product.name} sx={{ width: "100%", borderRadius: "10px" }} />
      <Typography variant="body1" sx={{ fontWeight: "bold", marginTop: "10px" }}>{product.name}</Typography>
      <Typography variant="body2" color="gray">₹{product.price}</Typography>
      <Button sx={{ marginTop: "10px", padding: "5px 10px", backgroundColor: "#f50057", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={() => onAddToCart(product.id)}>
        Add to Cart
      </Button>
      </CardContent>
    </Card>
  );
};
export default ProductCard;
