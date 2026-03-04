import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../api/axios";
import type { Product } from "../../products/redux/product.api";

export interface WishlistItem {
  id: number;
  product: Product;
  createdAt: string;
}

export interface AddToWishlistDto {
  productId: number;
}

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Wishlist"],
  endpoints: (builder) => ({
    // Get user's wishlist
    getMyWishlist: builder.query<WishlistItem[], void>({
      query: () => "/wishlist/my",
      transformResponse: (response: any) => response?.data || response || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Wishlist" as const, id })),
              { type: "Wishlist", id: "LIST" },
            ]
          : [{ type: "Wishlist", id: "LIST" }],
    }),

    // Add to wishlist
    addToWishlist: builder.mutation<WishlistItem, AddToWishlistDto>({
      query: (body) => ({
        url: "/wishlist/add",
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
    }),

    // Remove from wishlist
    removeFromWishlist: builder.mutation<{ message: string }, AddToWishlistDto>(
      {
        query: (body) => ({
          url: "/wishlist/remove",
          method: "DELETE",
          body,
        }),
        transformResponse: (response: any) => response?.data || response,
        invalidatesTags: (result, error, { productId }) => [
          { type: "Wishlist", id: "LIST" },
        ],
      },
    ),

    // Check if product is in wishlist
    checkWishlistStatus: builder.query<boolean, number>({
      query: (productId) => `/wishlist/check/${productId}`,
      providesTags: (result, error, productId) => [
        { type: "Wishlist", id: productId },
      ],
    }),
  }),
});

export const {
  useGetMyWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useCheckWishlistStatusQuery,
} = wishlistApi;
