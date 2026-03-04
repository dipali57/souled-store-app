import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "./hooks/useWishlist";
import { useCartOperations } from "../cart/hooks/useCartOperations";
import { ProductCard } from "../products/components/ProductCard";

export const WishlistPage = () => {
  const { wishlistItems, isLoading, toggleWishlist } = useWishlist();
  const { handleAddToCart, isAddingToCart } = useCartOperations();

  if (isLoading) return <div>Loading...</div>;

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
        <Link to="/products" className="text-red-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        My Wishlist ({wishlistItems.length})
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <ProductCard
            key={item.id}
            product={item.product}
            onAddToCart={(id) => handleAddToCart(id, item.product.stock)}
            onWishlistAction={toggleWishlist}
            wishlistIcon="trash"
            isAddingToCart={isAddingToCart(item.product.id)}
            showCategory={false}
          />
        ))}
      </div>
    </div>
  );
};
