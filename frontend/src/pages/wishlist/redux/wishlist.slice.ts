import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  localWishlistIds: number[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  localWishlistIds: [],
  loading: false,
  error: null,
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setLocalWishlistIds: (state, action: PayloadAction<number[]>) => {
      state.localWishlistIds = action.payload;
    },
    toggleLocalWishlist: (state, action: PayloadAction<number>) => {
      const index = state.localWishlistIds.indexOf(action.payload);
      if (index === -1) {
        state.localWishlistIds.push(action.payload);
      } else {
        state.localWishlistIds.splice(index, 1);
      }
    },
    clearLocalWishlist: (state) => {
      state.localWishlistIds = [];
    },
  },
});

export const { setLocalWishlistIds, toggleLocalWishlist, clearLocalWishlist } =
  wishlistSlice.actions;
export const wishlistReducer = wishlistSlice.reducer;
