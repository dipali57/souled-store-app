import { useEffect, useState } from "react";
import { BASE_URL } from "../../api/axios";
import {
  getUserCart,
  removeFromCart,
  updateQuantityFromCart,
} from "../../api/cart.api";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "../../types";
import { useGetUserCartQuery } from "./redux/cart.api";

export const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  let { data, isLoading } = useGetUserCartQuery();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getUserCart();
      setCartItems(res.data.cartItems || []);
    } finally {
      isLoading = false;
    }
  };

  // quantity update
  const updateQuantity = async (productId: number, qty: number) => {
    if (qty <= 0) return;
    await updateQuantityFromCart({ productId, quantity: qty });
    fetchCart();
  };

  // remove
  const removeItem = async (productId: number) => {
    await removeFromCart(productId);
    fetchCart();
  };

  const subtotal = data?.totalPrice ?? 0;
  const gst = subtotal * 0.05;
  const total = subtotal + gst;

  if (isLoading) return <div className="p-10">Loading cart...</div>;

  return (
    <div>
      {cartItems.length === 0 ? (
        <div className=" min-h-[70vh] mt-50 text-center items-center justify-center">
          <p className="text-2xl font-bold mb-4">
            Your Shopping Cart is empty 🛒
          </p>

          <p className="text-gray-600 mb-6">
            Please add something soon… carts have feelings too 🙂
          </p>

          <button
            onClick={() => navigate("/product")}
            className="bg-black text-white px-6 py-3 rounded font-semibold hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
          <div className="grid md:grid-cols-3 gap-8">
            {/* LEFT CART */}
            <div className="md:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 bg-white p-6 rounded-lg border"
                >
                  <input type="checkbox" className="mt-2" />

                  {/* IMAGE */}
                  <img
                    src={`${BASE_URL}${item.product.imageUrl}`}
                    className="w-36 h-44 object-cover rounded"
                  />

                  {/* DETAILS */}
                  <div className="flex-1">
                    <h2 className="font-semibold text-lg">
                      {item.product.name}
                    </h2>

                    <p className="text-gray-500 text-sm">
                      ₹{Number(item.product.price).toLocaleString()}
                    </p>

                    <div className="flex gap-4 mt-3">
                      <select className="border rounded px-3 py-1">
                        <option>Size: Select</option>
                        <option>S</option>
                        <option>M</option>
                        <option>L</option>
                      </select>

                      {/* QTY */}
                      <select
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.product.id,
                            Number(e.target.value),
                          )
                        }
                        className="border rounded px-3 py-1"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            Qty:{i + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* DELIVERY */}
                    {/* <p className="text-sm mt-3">
                    Estimated Delivery by <b>23 Feb</b>
                  </p> */}

                    {/* STOCK WARNING */}
                    {item.product.stock <= 5 && (
                      <p className="text-red-500 text-sm">
                        Hurry! Only {item.product.stock} in stock
                      </p>
                    )}

                    {/* BUTTONS */}
                    <div className="flex gap-4 mt-5">
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="border px-6 py-2 rounded text-sm hover:bg-gray-100"
                      >
                        REMOVE
                      </button>

                      <button className="border px-6 py-2 rounded text-sm hover:bg-gray-100">
                        MOVE TO WISHLIST
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BILL PANEL */}
            <div className="bg-white border rounded-lg p-6 h-fit">
              <h3 className="font-semibold mb-5">BILLING DETAILS</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Cart Total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping Charges</span>
                  <span className="text-green-600">Free</span>
                </div>

                <hr />

                <div className="flex justify-between font-bold text-base">
                  <span>Total Amount</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full mt-6 bg-teal-700 text-white py-3 rounded font-semibold">
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
