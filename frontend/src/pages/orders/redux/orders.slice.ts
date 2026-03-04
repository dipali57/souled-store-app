// src/store/orderSlice.ts
import { createSlice,type PayloadAction } from '@reduxjs/toolkit';
import type { Order } from './orders.api';

interface OrderState {
  selectedOrder: Order | null;
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  selectedOrder: null,
  orders: [],
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.selectedOrder = null;
    },
  },
});

export const { setOrders, setSelectedOrder, setLoading, setError, clearOrders } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;