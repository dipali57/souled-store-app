import React from "react";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";

interface CartItemProps {
  item: { id: number; name: string; price: number; quantity: number };
  onRemove: (id: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
  return (
    <Card sx={{ display: "flex", justifyContent: "space-between", padding: 2 }}>
      <CardContent>
        <Typography variant="h6">{item.name}</Typography>
        <Typography variant="body1">Price: ${item.price.toFixed(2)}</Typography>
        <Typography variant="body2">Quantity: {item.quantity}</Typography>
      </CardContent>
      <Grid item>
        <Button variant="contained" color="secondary" onClick={() => onRemove(item.id)}>
          Remove
        </Button>
      </Grid>
    </Card>
  );
};

export default CartItem;
