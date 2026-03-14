import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../api/axios";

export interface Category {
  name: string;
  description: string;
}
// Types for Cart
export interface CartItem {
  id: number;
  quantity: number;
  size?: string;
  product: {
    id: number;
    name: string;
    price: number;
    category: Category;
    imageUrl: string;
  };
}

export interface CartData {
  cartItems: CartItem[];
  totalPrice: number;
}

export interface Totals {
  subtotal: number;
  gst: number;
  total: number;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  catergory: Category;
  imageUrl: string;
}

export interface CartResponse {
  id: number;
  userId: number;
  totalItems: number;
  totalPrice: number;
  cartItems: CartItem[];
  createdAt: string;
  updatedAt: string;
}

interface UpdateCartDto {
  productId: number;
  quantity: number;
}

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Cart"],
  refetchOnFocus: false, // Disable refetch on window focus
  refetchOnReconnect: false, // Disable refetch on reconnect
  refetchOnMountOrArgChange: false,
  endpoints: (builder) => ({
    getUserCart: builder.query<CartResponse, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<CartResponse, number>({
      query: (productId) => ({
        url: "/cart/add",
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation<CartResponse, number>({
      query: (productId) => ({
        url: "/cart/remove",
        method: "DELETE",
        body: { productId },
      }),
      invalidatesTags: ["Cart"],
    }),

    updateQuantityFromCart: builder.mutation<CartResponse, UpdateCartDto>({
      query: (data) => ({
        url: "/cart/update",
        method: "PATCH",
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getUserCart", undefined, (draft) => {
            const item = draft.cartItems.find(
              (i) => i.productId === arg.productId,
            );
            if (item) {
              item.quantity = arg.quantity;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetUserCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateQuantityFromCartMutation,
} = cartApi;
