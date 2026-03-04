import { useState } from "react";
import { useAddToCartMutation } from "../redux/cart.api";

export const useCartOperations = () => {
  const [addToCart] = useAddToCartMutation();
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);

  const handleAddToCart = async (productId: number, stock: number) => {
    if (stock <= 0) {
      alert("Out of stock");
      return false;
    }
    
    try {
     setLoadingProductId(productId);
      await addToCart(productId).unwrap();
      alert("Added to cart!");
      return true;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart");
      return false;
    }finally {
        setLoadingProductId(null);
    }
};
const isAddingToCart = (productId: number) =>
loadingProductId === productId;

  return { handleAddToCart, isAddingToCart};
};