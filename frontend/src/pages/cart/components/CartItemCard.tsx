import { useMemo } from "react";
import { BASE_URL } from "../../../api/axios";
import type { CartItem } from "../redux/cart.api";

interface CartItemCardProps {
  item: CartItem;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onUpdateSize?: (id: number, size: string) => void;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onMoveToWishlist: (id: number) => void;
}

export const CartItemCard = ({
  item,
  isSelected,
  onSelect,
  onUpdateQuantity,
  onUpdateSize,
  onRemove,
  onMoveToWishlist,
}: CartItemCardProps) => {
  const itemTotal = item.product.price * item.quantity;

  const deliveryRange = useMemo(() => {
    const today = new Date();

    const start = new Date(today);
    start.setDate(today.getDate() + 4);

    const end = new Date(today);
    end.setDate(today.getDate() + 7);

    const format = (date: Date) =>
      date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });

    return `${format(start)} - ${format(end)}`;
  }, []);

  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 grid grid-cols-[auto_1fr] gap-6">
      {/* LEFT SIDE (Checkbox + Image) */}
      <div className="flex gap-4">
        <input
          type="checkbox"
          className="mt-1 w-4 h-4 cursor-pointer"
          checked={isSelected}
          onChange={() => onSelect(item.id)}
        />

        <img
          src={`${BASE_URL}${item.product.imageUrl}` || "/placeholder.jpg"}
          alt={item.product.name}
          className="w-36 h-44 object-cover rounded"
        />
      </div>
      <div className="flex flex-col flex-1">
        {/* Top Section */}
        <div className="flex justify-between">
          <div>
            <h2 className="font-semibold text-lg">{item.product.name}</h2>
            <p className="text-gray-500 text-sm">
              {item.product.category.name}
            </p>
            <div className="mt-3">
            <div className="flex gap-4 items-center flex-wrap">
              {/* Size */}
              <select
                value={item.size || "S"}
                onChange={(e) => onUpdateSize?.(item.id, e.target.value)}
                className="border border-gray-200 rounded px-3 py-1 text-xs"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>

              {/* Quantity */}
              <select
                value={item.quantity}
                onChange={(e) =>
                  onUpdateQuantity(item.product.id, Number(e.target.value))
                }
                className="border border-gray-200 rounded px-3 py-1 text-xs"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Qty: {i + 1}
                  </option>
                ))}
              </select>
              </div>
              <div className="mt-2">
              <span className="text-sm text-gray-500">
                Estimated Delivery by: {deliveryRange}
              </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="font-semibold text-lg">
              ₹{itemTotal.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">MRP incl. of all taxes</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-14 mb-4"></div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => onRemove(item.id)}
            className="border border-gray-200 px-6 py-2 rounded text-xs hover:bg-gray-100"
          >
            REMOVE
          </button>

          <button
            onClick={() => onMoveToWishlist(item.productId)}
            className="border border-gray-200 px-6 py-2 rounded text-xs hover:bg-gray-100"
          >
            MOVE TO WISHLIST
          </button>
        </div>
      </div>
    </div>
  );
};
