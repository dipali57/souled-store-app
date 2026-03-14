import { configureStore } from "@reduxjs/toolkit";
import { cartReducer } from "../pages/cart/redux/cart.slice";
import { cartApi } from "../pages/cart/redux/cart.api";
import { productReducer } from "../pages/products/redux/product.slice";
import { productApi } from "../pages/products/redux/product.api";
import { wishlistReducer } from "../pages/wishlist/redux/wishlist.slice";
import { wishlistApi } from "../pages/wishlist/redux/wishlist.api";
import { userReducer } from "../pages/user/redux/user.slice";
import { userApi } from "../pages/user/redux/user.api";
import { orderReducer } from "../pages/orders/redux/orders.slice";
import { orderApi } from "../pages/orders/redux/orders.api";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

export const store = configureStore({
  reducer: {
    product: productReducer,
    [productApi.reducerPath]: productApi.reducer,
    cartUI: cartReducer,
    [cartApi.reducerPath]: cartApi.reducer,
    wishlist: wishlistReducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,
    orders: orderReducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApi.middleware)
      .concat(wishlistApi.middleware)
      .concat(cartApi.middleware)
      .concat(userApi.middleware)
      .concat(orderApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

