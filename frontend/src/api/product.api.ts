import { api, PRODUCT_URL } from './axios';
import type { FetchProductsResponse, Product } from './types/product.types';

export const fetchAllProducts = async () => await api.get<Product[]>(PRODUCT_URL);

export const fetchProducts = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  sort?: string;
  search?: string;
}) => await api.get<FetchProductsResponse>(PRODUCT_URL, {params});

export const fetchProductById = async (id: number) =>  await api.get<Product>(`${PRODUCT_URL}/${id}`);

export const fetchProductsByCategory = async (categoryId: number) => await api.get<Product[]>(`${PRODUCT_URL}/category/${categoryId}`);

// Admin: Fetch all products (protected route - requires admin token)
// export const fetchAllProductsAdmin = async () => {
//   const token = getAuthToken();
  
//   return await api.get<Product[]>(ADMIN_PRODUCTS_URL)
// };

// // Admin: Fetch products with pagination for admin panel
// export const fetchProductsAdmin = async (params?: {
//   page?: number;
//   limit?: number;
//   search?: string;
// }) => {
//   const token = getAuthToken();
  
//   return await api.get<FetchProductsResponse>(ADMIN_PRODUCTS_URL, {
//     params: {
//       ...params,
//     },
//   });
// };


