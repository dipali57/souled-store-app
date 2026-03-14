import { useEffect, useCallback, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  useGetUserCartQuery,
  useRemoveFromCartMutation,
  useUpdateQuantityFromCartMutation,
  type CartItem,
} from "./redux/cart.api";
import { useCart } from "./hooks/useCart";
import { openCartDrawer } from "./redux/cart.slice";
import { CartItemCard } from "./components/CartItemCard";
import { BillingSection } from "./components/BillingSection";
import { useCheckoutMutation } from "../orders/redux/orders.api";
import { useAddToWishlistMutation } from "../wishlist/redux/wishlist.api";
import { useAuth } from "../../auth/AuthContext";

export const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[70vh]">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-700 border-r-transparent" />
      <p className="mt-4 text-gray-600">Loading your cart...</p>
    </div>
  </div>
);

export const EmptyCart = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://fakestoreapi.com/products/categories",
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  return (
    <div className="flex flex-col min-h-[70vh] mt-10 text-center px-4 max-w-[1200px] mx-auto w-full">
      {/* Top Section */}
      <div className="flex-1 flex items-center justify-center">
        <div>
          <p className="text-2xl font-bold mb-4">
            Your Shopping Cart is empty 🛒
          </p>
          <p className="text-gray-600">
            Please add something soon… carts have feelings too 🙂
          </p>
        </div>
      </div>

      {/* Category Section - with light gray background */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-gray-100 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-3 text-center">
            Popular Categories
          </h3>

          {loading ? (
            <p className="text-gray-500 text-center">Loading categories...</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/product?category=${category}`)}
                  className="bg-white border border-gray-200 text-black px-3 py-1.5 rounded text-sm font-medium capitalize hover:bg-gray-50 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Buttons Section */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={() => navigate("/product")}
            className="bg-teal-50 text-teal-700 text-xs py-2 px-1 border rounded font-bold w-36"
          >
            CONTINUE SHOPPING
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-teal-700 text-white text-xs py-2 px-2 rounded font-bold w-36"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export const Cart = () => {
  // RTK Queries
  const { user } = useAuth();
  const { data, isLoading, refetch, error } = useGetUserCartQuery(undefined, {skip: !user});
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateQuantity] = useUpdateQuantityFromCartMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();
  const [addToWishlist] = useAddToWishlistMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Custom hook for cart logic
  const {
    selectedItems,
    selectAll,
    totals,
    handleSelectItem,
    handleSelectAll,
    clearSelectedItem,
    selectedCount,
  } = useCart(data?.cartItems);

  // Effects
  useEffect(() => {
    dispatch(openCartDrawer());
  }, [dispatch]);

  
  // Handlers
  const handleUpdateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      if (quantity <= 0) return;
      try {
        await updateQuantity({ productId, quantity }).unwrap();
        await refetch();
        toast.success("Quantity updated");
      } catch (error) {
        toast.error("Failed to update quantity");
      }
    },
    [updateQuantity, refetch],
  );
  const handleRemoveItem = useCallback(
    async (item: CartItem) => {
      try {
        console.log("Attempting to remove item:", item);
        console.log("Product ID being sent:", item.product.id); // This should be 10, not 30

        // Send the product ID, not the cart item ID
        await removeFromCart(item.product.id).unwrap();

        await refetch();
        clearSelectedItem(item.id);
        toast.success("Item removed");
      } catch (error: any) {
        console.error("Full remove error:", error);
        toast.error(error?.data?.message || "Failed to remove item");
      }
    },
    [removeFromCart, refetch, clearSelectedItem],
  );
  const handleMoveToWishlist = useCallback(
    async (item: CartItem) => {
      try {
        console.log("Moving to wishlist - Product ID:", item.product.id);

        // Step 1: Add to wishlist (using AddToWishlistDto)
        await addToWishlist({ productId: item.product.id }).unwrap();

        // Step 2: Remove from cart (using productId)
        await removeFromCart(item.product.id).unwrap();

        // Step 3: Clear from local state
        clearSelectedItem(item.id);

        // Step 4: Refetch cart data
        await refetch();

        toast.success("Moved to wishlist ❤️");
      } catch (error: any) {
        console.error("Move to wishlist error:", error);

        // More specific error messages
        if (error?.data?.message) {
          toast.error(error.data.message);
        } else {
          toast.error("Failed to move to wishlist");
        }
      }
    },
    [addToWishlist, removeFromCart, refetch, clearSelectedItem],
  );
  const handlePlaceOrder = useCallback(async () => {
    if (selectedItems.size === 0) {
      toast.error("Please select at least one item");
      return;
    }
    try {
      const cartItemIds = Array.from(selectedItems);
      console.log("cartItemIds", cartItemIds);
      await checkout({ cartItemIds }).unwrap();
      await refetch();
      toast.success("Order placed successfully 🎉");
      navigate("/orders"); // redirect to orders page
      // navigate("/checkout", { state: { selectedItems: selectedItemsData, selectedIds: Array.from(selectedItems), }, });
    } catch (error) {
      toast.error("Checkout failed");
    }
  }, [selectedItems, checkout, navigate]);

  // Loading state
  if (isLoading) return <LoadingState />;

  if (error && 'status' in error && error.status === 401) {
    return <Navigate to="/login" />;
  }
  // Empty cart
  if (!data?.cartItems?.length) return <EmptyCart />;

  const cartItems = data.cartItems;

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Section - Cart Items */}
        <div className="md:col-span-2 space-y-2">
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                className="w-5 h-5 cursor-pointer"
                checked={selectAll}
                onChange={handleSelectAll}
                aria-label="Select all items"
              />
              <span className="font-medium">
                {selectedCount}/{cartItems.length} ITEMS SELECTED (₹
                {totals.subtotal})
              </span>
            </div>
          </div>

          {/* Cart Items */}
          {cartItems.map((item: CartItem) => (
            <CartItemCard
              key={item.id}
              item={item}
              isSelected={selectedItems.has(item.id)}
              onSelect={handleSelectItem}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={() => handleRemoveItem(item)}
              onMoveToWishlist={() => handleMoveToWishlist(item)}
            />
          ))}

          {/* Promotional Sections */}
          {/* <PromoSections /> */}
        </div>

        {/* Right Section - Billing */}
        <BillingSection
          totals={totals}
          onPlaceOrder={handlePlaceOrder}
          itemCount={selectedCount}
          isLoading={isCheckingOut}
        />
      </div>
    </div>
  );
};
