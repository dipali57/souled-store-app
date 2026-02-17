// api/productApi.ts
import axios from 'axios';
import { PRODUCT_URL } from './axios';
import type { FetchProductsResponse, Product } from './types/product.types';

// Get token from localStorage
// const getAuthToken = () => localStorage.getItem('token');

// Fetch all products (public route - no auth required)
export const fetchAllProducts = async () => {
  return await axios.get<Product[]>(PRODUCT_URL, {
    headers: {
      Accept: 'application/json',
    },
  });
};

// Fetch products with pagination, filtering, sorting
export const fetchProducts = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  sort?: string;
  search?: string;
}) => {
  return await axios.get<FetchProductsResponse>(PRODUCT_URL, {
    headers: {
      Accept: 'application/json',
    },
    params: {
      ...params,
    },
  });
};

// Fetch single product by ID
export const fetchProductById = async (id: number) => {
  return await axios.get<Product>(`${PRODUCT_URL}/${id}`, {
    headers: {
      Accept: 'application/json',
    },
  });
};

// Fetch products by category
export const fetchProductsByCategory = async (categoryId: number) => {
  return await axios.get<Product[]>(`${PRODUCT_URL}/category/${categoryId}`, {
    headers: {
      Accept: 'application/json',
    },
  });
};

// Admin: Fetch all products (protected route - requires admin token)
// export const fetchAllProductsAdmin = async () => {
//   const token = getAuthToken();
  
//   return await axios.get<Product[]>(ADMIN_PRODUCTS_URL, {
//     headers: {
//       Accept: 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

// // Admin: Fetch products with pagination for admin panel
// export const fetchProductsAdmin = async (params?: {
//   page?: number;
//   limit?: number;
//   search?: string;
// }) => {
//   const token = getAuthToken();
  
//   return await axios.get<FetchProductsResponse>(ADMIN_PRODUCTS_URL, {
//     headers: {
//       Accept: 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     params: {
//       ...params,
//     },
//   });
// };


