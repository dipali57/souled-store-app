// redux/product/product.api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../api/axios";

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  sku: string | null;
  imageUrl: string;
  category: {
    id: number;
    name: string;
    description: string;
  };
  reviews: Review[];
  isActive: boolean;
}

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Product", "Products"],
  endpoints: (builder) => ({
    // Get all products
    getAllProducts: builder.query<Product[], void>({
      query: () => "/products",
      transformResponse: (response: any) => Array.isArray(response) ? response : response?.data || [],
      providesTags: ["Products"],
    }),

    // Get single product by ID
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: any) => response?.data || response,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Get products by category
    getProductsByCategory: builder.query<Product[], number>({
      query: (categoryId) => `/products/category/${categoryId}`,
      transformResponse: (response: any) => Array.isArray(response) ? response : response?.data || [],
      providesTags: ["Products"],
    }),

    // Search products
    searchProducts: builder.query<Product[], string>({
      query: (searchTerm) => `/products/search?q=${searchTerm}`,
      transformResponse: (response: any) => Array.isArray(response) ? response : response?.data || [],
      providesTags: ["Products"],
    }),

    // Create product (admin only)
    createProduct: builder.mutation<Product, FormData>({
      query: (productData) => ({
        url: "/products",
        method: "POST",
        body: productData,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ["Products"],
    }),

    // Update product (admin only)
    updateProduct: builder.mutation<Product, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        "Products",
      ],
    }),

    // Delete product (admin only)
    deleteProduct: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        "Products",
      ],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;