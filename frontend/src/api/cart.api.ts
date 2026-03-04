import {
  ADD_TO_CART_URL,
  api,
  GET_USER_CART_URL,
  REMOVE_FROM_CART_URL,
  UPDATE_FROM_CART_URL,
} from "./axios";
import type { Cart } from "./types/cart.types";

export const addToCart = async (productId: number) => await api.post(ADD_TO_CART_URL, {productId});

export const getUserCart = async () => await api.get(GET_USER_CART_URL);

export const removeFromCart = async (productId: number) => await api.delete(REMOVE_FROM_CART_URL, {data: {productId}});

export const updateQuantityFromCart = async (data: Cart) => await api.patch(UPDATE_FROM_CART_URL, data);
