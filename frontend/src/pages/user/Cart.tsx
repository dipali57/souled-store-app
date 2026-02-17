// src/pages/user/Cart.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { getUserCart, removeFromCart, updateQuantityFromCart } from '../../api/cart.api';

interface CartItem extends Product {
  quantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const response = await getUserCart();
    console.log('response:', response.data);
    // const response = await fetch('/api/cart');
    // const data = await response.json();
    setCartItems(response.data);
      console.log('cart items:', cartItems);
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    // await fetch(`/api/cart/items/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ quantity }),
    // });
    await updateQuantityFromCart({productId, quantity})
    fetchCart();
  };

  const removeItem = async (id: string) => {
    // await fetch(`/api/cart/items/${id}`, { method: 'DELETE' });
    await removeFromCart(id);
    fetchCart();
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);


  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center border-b py-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price}</p>
                  <div className="flex items-center mt-2">
                    <button 
                      onClick={() => updateQuantity(+item.id, item.quantity - 1)}
                      className="px-2 py-1 border"
                    >-</button>
                    <span className="mx-2">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(+item.id, item.quantity + 1)}
                      className="px-2 py-1 border"
                    >+</button>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="border p-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Total:</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;