import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../../api/axios';

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    price: number;
    images?: string[];
    size?: string;
  };
}

export interface Order {
  id: number;
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Return Received';
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface UpdateOrderStatusDto {
  status: string;
}

export const orderApi = createApi({
  reducerPath: 'orderApi',
   baseQuery: fetchBaseQuery({
     baseUrl: BASE_URL,
     credentials: "include",
     prepareHeaders: (headers) => {
       headers.set("Content-Type", "application/json");
       return headers;
     },
   }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    // Get current user's orders
    getUserOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Orders' as const, id })),
              { type: 'Orders', id: 'LIST' },
            ]
          : [{ type: 'Orders', id: 'LIST' }],
    }),

    // Get single order details
    getOrderById: builder.query<Order, number>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),

    // Checkout (place order)
    checkout: builder.mutation<Order, void>({
      query: () => ({
        url: '/orders/checkout',
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),

    // Update order status (admin only)
    updateOrderStatus: builder.mutation<void, { id: number; status: UpdateOrderStatusDto }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: status,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Orders', id }],
    }),

    // Get all orders (admin only)
    getAllOrders: builder.query<Order[], void>({
      query: () => '/orders/all',
      providesTags: [{ type: 'Orders', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCheckoutMutation,
  useUpdateOrderStatusMutation,
  useGetAllOrdersQuery,
} = orderApi;