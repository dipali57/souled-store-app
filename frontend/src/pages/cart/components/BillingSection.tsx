import type { Totals } from "../redux/cart.api";

interface BillingSectionProps {
  totals: Totals;
  onPlaceOrder: () => void;
  itemCount: number;
  isLoading: boolean;
}

export const BillingSection = ({ totals, onPlaceOrder, itemCount, isLoading }: BillingSectionProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
      <h3 className="font-semibold mb-5">BILLING DETAILS</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Cart Total (Excl. of all taxes)</span>
          <span>₹{totals.subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>GST (18%)</span>
          <span>₹{totals.gst.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping Charges</span>
          <span className="text-green-600">
            Free ₹50.00
          </span>
        </div>

        <hr />

        <div className="flex justify-between font-bold text-base">
          <span>Total Amount</span>
          <span>₹{totals.total.toFixed(2)}</span>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
        </p>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={isLoading}
        className="w-full mt-6 bg-teal-700 text-white py-1 rounded font-semibold hover:bg-teal-800 transition"
      >
        {isLoading ? "Placing Order..." : "PLACE ORDER"}
      </button>
    </div>
  );
};