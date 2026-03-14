import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Heart, Share2, Minus, Plus } from "lucide-react";
import { useGetProductByIdQuery } from "./redux/product.api";
import { addToRecentlyViewed, toggleWishlist } from "./redux/product.slice";
import { useAppDispatch, useAppSelector, type RootState } from "../../store/store";
import { BASE_URL } from "../../api/axios";
import { useCartOperations } from "../cart/hooks/useCartOperations";
import toast from "react-hot-toast";

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const productId = Number(id);
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(productId, {
    skip: !productId,
  });

  const { handleAddToCart: addToCart, isAddingToCart } = useCartOperations();

  const wishlist = useAppSelector((state: RootState) => state.product.wishlist);

  const isInWishlist = productId ? wishlist.includes(productId) : false;

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [sizeError, setSizeError] = useState("");

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  useEffect(() => {
    if (productId) {
      dispatch(addToRecentlyViewed(productId));
    }
  }, [productId, dispatch]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCartClick = async () => {
    if (!selectedSize) {
      setSizeError("Please select a size");
      return;
    }
    if (!product) {
      toast.error("Product not found");
      return;
    }
    await addToCart(productId, product.stock);
    console.log(
      `Added to cart: ${product.name}, Size: ${selectedSize}, Quantity: ${quantity}`,
    );
  };

  const handleToggleWishlist = () => {
    if (productId) {
      dispatch(toggleWishlist(productId));
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const checkDelivery = () => {
    if (pincode.length === 6) {
      setDeliveryMessage("Delivery available in 3-5 business days");
    } else {
      setDeliveryMessage("");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-600">Failed to load product details</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-red-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-red-600">
          Products
        </Link>
        <span className="mx-2">/</span>
        <Link
          to={`/products?category=${product.category.id}`}
          className="hover:text-red-600"
        >
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={
              `${BASE_URL}${product.imageUrl}` ||
              "https://placehold.co/600x800/e2e8f0/1e293b?text=No+Image"
            }
            alt={product.name}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-gray-200 text-sm px-3 py-1 rounded">
              OVERSIZED
            </span>
            <span className="text-gray-600">{product.category.name}</span>
          </div>

          <div className="mb-4">
            <span className="font-semibold">FIT</span>
            <span className="ml-2 text-gray-600">Regular Fit</span>
          </div>

          <div className="mb-4">
            <span className="text-3xl font-bold">₹{product.price}</span>
            <p className="text-sm text-gray-600">Price incl. of all taxes</p>
          </div>

          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="text-green-600 text-sm">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-red-600 text-sm">Out of Stock</span>
            )}
          </div>

          <div className="mb-6">
            <span className="text-sm bg-gray-100 px-3 py-1 rounded">
              TEXTURED FABRIC
            </span>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="font-semibold">Please select a size.</span>
              <button className="text-red-600 text-sm hover:underline">
                SIZE CHART
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={`w-12 h-12 border rounded-md font-medium transition ${
                    selectedSize === size
                      ? "bg-red-600 text-white border-red-600"
                      : "border-gray-300 hover:border-red-600"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizeError && (
              <p className="text-red-500 text-sm mt-2">{sizeError}</p>
            )}
          </div>

          <div className="mb-6">
            <span className="font-semibold block mb-3">Quantity</span>
            <div className="flex items-center border border-gray-300 w-fit rounded">
              <button
                onClick={decrementQuantity}
                className="px-4 py-2 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="px-6 py-2 border-x border-gray-300 min-w-[60px] text-center">
                {quantity.toString().padStart(2, "0")}
              </span>
              <button
                onClick={incrementQuantity}
                className="px-4 py-2 hover:bg-gray-100"
                disabled={product.stock <= quantity}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleAddToCartClick}
              disabled={
                !selectedSize ||
                product.stock === 0 ||
                isAddingToCart(productId)
              }
              className="flex-1 bg-red-600 text-white py-4 rounded-md font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart(productId) ? "ADDING..." : "ADD TO CART"}
            </button>
            <button
              onClick={handleToggleWishlist}
              className="flex-1 border border-gray-300 py-4 rounded-md font-semibold hover:border-red-600 hover:text-red-600 transition flex items-center justify-center gap-2"
            >
              <Heart
                size={20}
                className={isInWishlist ? "fill-red-600 text-red-600" : ""}
              />
              {isInWishlist ? "IN WISHLIST" : "ADD TO WISHLIST"}
            </button>
          </div>

          <div className="mb-8">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
            >
              <Share2 size={18} />
              Share
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold mb-3">Delivery Details</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter Pincode"
                maxLength={6}
                className="flex-1 border border-gray-300 p-3 rounded focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <button
                onClick={checkDelivery}
                className="px-6 py-3 bg-gray-900 text-white rounded hover:bg-black transition"
              >
                Check
              </button>
            </div>
            {deliveryMessage && (
              <p className="text-sm text-green-600 mt-2">{deliveryMessage}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Enter pincode to check delivery availability
            </p>
          </div>

          {product.reviews && product.reviews.length > 0 && (
            <div className="border-t border-gray-200 mt-6 pt-6">
              <h3 className="font-semibold mb-3">Customer Reviews</h3>
              <div className="space-y-4">
                {product.reviews.slice(0, 3).map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 pb-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        Rating: {review.rating}/5
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
