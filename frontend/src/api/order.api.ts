import { api, FETCH_ALL_ORDERS, ORDER_URL, PLACE_ORDER } from "./axios";
type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export const placeAnOrder = async () => await api.post(PLACE_ORDER);

export const fetchUserById = async (params: number) => await api.get(ORDER_URL, {params});

export const fetchAllOrders = async () => await api.get(FETCH_ALL_ORDERS);

export const updateOrderStatus = (
  orderId: number,
  status: OrderStatus
) => api.patch(`/orders/${orderId}/status`, { status });



