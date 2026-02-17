// components/ProductCard.tsx
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { BASE_URL } from "../api/axios";
import { addToCart } from "../api/cart.api";

// Your exact product interface from API
interface Product {
  id: number;
  name: string;
  description: string;
  price: string; // Note: price is string in your API
  stock: string; // Note: stock is string in your API
  imageUrl: string;
  category: {
    id: number;
    name: string;
    description: string;
  };
}

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
const [loading, setLoading] = useState(false);
  // const { user } = useAuth();
  const navigate = useNavigate();
  const { id, name, description, price, stock, imageUrl, category } = product;

  // Convert price from string to number
  const numericPrice = parseFloat(price);
  const numericStock = parseInt(stock);

  // Generate a random rating for demo (since not in API)
  // const rating = (Math.random() * 2 + 3).toFixed(1); // Random between 3-5
  // const reviewCount = Math.floor(Math.random() * 100) + 10; // Random between 10-110

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (numericStock <= 0) {
      alert("Out of stock");
      return;
    }
    console.log("Added to cart:", product);

        if(loading) return;
    setLoading(true);
    

    // Add to cart logic here
    try {
      console.log('id:', id);
      const res = await addToCart(id);
      console.log(res.data)
      alert("Added to cart!");
      navigate("/cart");
    } catch {
      console.log("Failed to add to cart");
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    console.log("Wishlist toggled:", product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  // Check if product is out of stock
  const isOutOfStock = numericStock <= 0;

  return (
    <div
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="block relative aspect-[3/4] overflow-hidden">
      {/* <Link
        to={`/product/${id}`}
        className="block relative aspect-[3/4] overflow-hidden"
      > */}
        {/* Product Image */}
        <Link
        to={`/product/${id}`}
        className="block relative aspect-[3/4] overflow-hidden"
        >
        <img
          src={
            `${BASE_URL}${imageUrl}` ||
            "https://placehold.co/600x800/e2e8f0/1e293b?text=No+Image"
          }
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/600x800/e2e8f0/1e293b?text=No+Image";
          }}
        />
       </Link>
        {/* Stock Badge */}
        {isOutOfStock ? (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            OUT OF STOCK
          </span>
        ) : numericStock < 10 ? (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
            ONLY {numericStock} LEFT
          </span>
        ) : null}

        {/* Category Badge */}
        <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {category.name}
        </span>
  
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Quick Add Button - Visible on Hover */}
        {!isOutOfStock && (
          <div
            className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent transform transition-all duration-300`}
          >
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
             { loading ?"Adding..": "Add to Cart"}
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category Name */}
        <Link
          to={`/category/${category.id}`}
          className="text-xs text-gray-500 hover:text-red-600 uppercase tracking-wider"
        >
          {category.name}
        </Link>

        {/* Product Name */}
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-red-600 transition line-clamp-2 mb-1 text-lg">
            {name}
          </h3>
        </Link>

        {/* Description (truncated) */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{description}</p>

        {/* Rating (simulated) */}
        {/* <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(parseFloat(rating))
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div> */}

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">
              ₹{numericPrice.toLocaleString()}
            </span>
          </div>

          {/* Stock Status */}
          {/* <span className={`text-xs font-medium ${
            isOutOfStock ? 'text-red-600' : 'text-green-600'
          }`}>
            {isOutOfStock ? 'Out of Stock' : `${numericStock} in stock`}
          </span> */}
        </div>
      </div>
    </div>
  );
};
