import axios from "axios";
import { ADD_TO_CART_URL, GET_USER_CART_URL, REMOVE_FROM_CART_URL, UPDATE_FROM_CART_URL } from "./axios";
import type { Cart } from "./types/cart.types";

export const addToCart = async (params: number) => {
 return await axios.post(ADD_TO_CART_URL, {
    headers: {
      ContentType: 'application/json',
    },
    params,
  });
};

export const getUserCart = async () => {
 return await axios.get(GET_USER_CART_URL, {
    headers: {
      Accept: 'application/json',
    },
  });
};

export const removeFromCart = async (params: string) => {
 return await axios.delete(REMOVE_FROM_CART_URL, {
    headers: {
      Accept: 'application/json',
    },
    params
  });
};

export const updateQuantityFromCart = async (params: Cart) => {
 return await axios.patch(UPDATE_FROM_CART_URL, {
    headers: {
      Accept: 'application/json',
    },
    ...params
  });
};
