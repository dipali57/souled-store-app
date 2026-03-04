import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { BASE_URL } from "../../../api/axios";
import type { Product } from "../redux/product.api";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  onWishlistAction?: (productId: number) => void; // Generic action for wishlist (add/remove)
  wishlistIcon?: 'heart' | 'trash';
  isWishlisted?: boolean;
  isAddingToCart?: boolean;
  showCategory?: boolean;
}

export const ProductCard = ({ 
  product,
  onAddToCart,
  onWishlistAction,
  wishlistIcon = 'heart',
  isWishlisted,
  isAddingToCart,
  showCategory = false
}: ProductCardProps) => {
  const { id, name, description, price, stock, imageUrl, category } = product;
  const isOutOfStock = stock <= 0;

  const getWishlistIcon = () => {
    if (wishlistIcon === 'trash') {
      return <Trash2 className="w-4 h-4 text-red-500" />;
    }
    return (
      <Heart 
        className={`w-4 h-4 transition-colors ${
          isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
        }`} 
      />
    );
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link to={`/product/${id}`}>
          <img
            src={`${BASE_URL}${imageUrl}` || "/placeholder.jpg"}
            alt={name}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
        </Link>

        {/* Stock Badge */}
        {isOutOfStock ? (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
            OUT OF STOCK
          </span>
        ) : stock < 10 ? (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded z-10">
            ONLY {stock} LEFT
          </span>
        ) : null}

        {/* Category Badge  */}
        {/* {showCategory && (
          <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
            {category.name}
          </span>
        )} */}

        {onWishlistAction && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWishlistAction(id);
            }}
            // className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-20 opacity-0 group-hover:opacity-100"
             className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            {getWishlistIcon()}
          </button>
        )}

        {/* Add to Cart Button */}
        {onAddToCart && !isOutOfStock && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(id);
              }}
              disabled={isAddingToCart}
              className="w-full bg-white text-gray-900 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {showCategory && (
          <Link to={`/category/${category.id}`} className="text-xs text-gray-500 hover:text-red-600 uppercase">
            {category.name}
          </Link>
        )}
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-red-600 line-clamp-2 text-lg">
            {name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{description}</p>
        <span className="text-xl font-bold">₹{parseFloat(price).toLocaleString()}</span>
      </div>
    </div>
  );
};