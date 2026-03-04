import { createSlice } from "@reduxjs/toolkit";


interface CartUIState {
  isDrawerOpen: boolean;
}

const initialState: CartUIState = {
  isDrawerOpen: false,
};

const cartSlice = createSlice({
  name: 'cartUI',
  initialState,
  reducers: {
    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    toggleCartDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
