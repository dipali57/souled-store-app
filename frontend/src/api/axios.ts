import axios from "axios";

export const BASE_URL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

export const SIGNIN_URL = `${BASE_URL}/auth/signin`;
export const SIGNUP_URL = `${BASE_URL}/auth/signup`;

export const FORGOT_PASSWORD_URL = `${BASE_URL}/auth/forgot-password`;
export const RESET_PASSWORD_URL = `${BASE_URL}/auth/reset-password`;

export const AUTH_STATUS =`${BASE_URL}/auth/status`;
export const LOGOUT_URL = `${BASE_URL}/auth/logout`;

export const PRODUCT_URL=`${BASE_URL}/products`;
export const ADD_PRODUCT_URL = `${BASE_URL}/products/add`;

export const CART_URL = `${BASE_URL}/cart`;
export const ADD_TO_CART_URL = `${BASE_URL}/cart/add`;
export const GET_USER_CART_URL =`${BASE_URL}/cart`;
export const REMOVE_FROM_CART_URL = `${BASE_URL}/cart/remove`;
export const UPDATE_FROM_CART_URL = `${BASE_URL}/cart/update`;

export const ORDER_URL = `${BASE_URL}/orders`;
export const FETCH_ALL_ORDERS = `${BASE_URL}/orders/all`;
export const PLACE_ORDER = `${BASE_URL}/orders/checkout`;

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': "application/json",
  },
  withCredentials: true
});
