import { useState, useMemo, useCallback } from "react";
import type { CartItem, Totals } from "../redux/cart.api";

export const useCart = (cartItems: CartItem[] = []) => {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // Memoized values
  const selectedItemsData = useMemo(
    () => cartItems.filter((item) => selectedItems.has(item.id)),
    [cartItems, selectedItems],
  );

  const selectAll = useMemo(
    () =>
      cartItems.length > 0 &&
      cartItems.every((item) => selectedItems.has(item.id)),
    [cartItems, selectedItems],
  );

  const estimatedTotals: Totals = useMemo(() => {
    const subtotal = selectedItemsData.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    const gst = subtotal * 0.18;
    return { subtotal, gst, total: subtotal + gst };
  }, [selectedItemsData]);

  // Handlers
  const handleSelectItem = useCallback((cartItemId: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.has(cartItemId)
        ? newSet.delete(cartItemId)
        : newSet.add(cartItemId);
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedItems((prev) =>
      prev.size === cartItems.length
        ? new Set()
        : new Set(cartItems.map((item) => item.id)),
    );
  }, [cartItems]);

  const clearSelectedItem = useCallback((cartItemId: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(cartItemId);
      return newSet;
    });
  }, []);

  return {
    selectedItems,
    selectedItemsData,
    selectAll,
    totals: estimatedTotals,
    handleSelectItem,
    handleSelectAll,
    clearSelectedItem,
    selectedCount: selectedItems.size,
  };
};
