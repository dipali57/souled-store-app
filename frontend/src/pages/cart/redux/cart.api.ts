import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../../api/axios';

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartResponse {
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
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({

    getUserCart: builder.query<CartResponse, void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),

    addToCart: builder.mutation<CartResponse, number>({
      query: (productId) => ({
        url: '/cart/add',
        method: 'POST',
        body: { productId },
      }),
      invalidatesTags: ['Cart'],
    }),

    removeFromCart: builder.mutation<CartResponse, number>({
      query: (productId) => ({
        url: '/cart/remove',
        method: 'DELETE',
        body: { productId },
      }),
      invalidatesTags: ['Cart'],
    }),

    updateQuantityFromCart: builder.mutation<CartResponse, UpdateCartDto>({
      query: (data) => ({
        url: '/cart/update',
        method: 'PATCH',
        body: data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getUserCart', undefined, (draft) => {
            const item = draft.cartItems.find(
              (i) => i.productId === arg.productId
            );
            if (item) {
              item.quantity = arg.quantity;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetUserCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateQuantityFromCartMutation,
} = cartApi;