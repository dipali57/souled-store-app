import { useCallback } from "react";
import {
  useGetMyWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../redux/wishlist.api";
import { useAuth } from "../../../auth/AuthContext";

export const useWishlist = () => {
  const { user } = useAuth();
  const {
    data: wishlistItems = [],
    isLoading,
    error,
    refetch,
  } = useGetMyWishlistQuery(undefined, {skip: !user});

  const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemoving }] =
    useRemoveFromWishlistMutation();

  const wishlistProductIds = wishlistItems.map((item) => item.product.id);

  const isInWishlist = useCallback(
    (productId: number) => {
      return wishlistProductIds.includes(productId);
    },
    [wishlistProductIds],
  );

  const toggleWishlist = useCallback(
    async (productId: number) => {
      try {
        if (isInWishlist(productId)) {
          await removeFromWishlist({ productId }).unwrap();
          return { success: true, action: "removed" };
        } else {
          await addToWishlist({ productId }).unwrap();
          return { success: true, action: "added" };
        }
      } catch (error) {
        console.error("Failed to toggle wishlist:", error);
        return { success: false, error };
      }
    },
    [addToWishlist, removeFromWishlist, isInWishlist],
  );

  const wishlistCount = wishlistItems.length;

  return {
    wishlistItems,
    wishlistProductIds,
    isInWishlist,
    toggleWishlist,
    isLoading,
    isAdding,
    isRemoving,
    error,
    refetch,
    wishlistCount,
  };
};
