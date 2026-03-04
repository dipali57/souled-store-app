import { ProductCard } from "./ProductCard";
import type { Product } from "../redux/product.api";

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (productId: number) => void;
  onWishlistAction?: (productId: number) => void;
  isInWishlist?: (productId: number) => boolean;
  isAddingToCart?: (productId: number) => boolean;
  wishlistIcon?: "heart" | "trash";
  showCategory?: boolean;
}

export const ProductGrid = ({
  products,
  onAddToCart,
  onWishlistAction,
  isInWishlist,
  isAddingToCart,
  wishlistIcon = "heart",
  showCategory = false,
}: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onWishlistAction={onWishlistAction}
          isWishlisted={isInWishlist?.(product.id)}
          isAddingToCart={isAddingToCart?.(product.id)}
          wishlistIcon={wishlistIcon}
          showCategory={showCategory}
        />
      ))}
    </div>
  );
};
