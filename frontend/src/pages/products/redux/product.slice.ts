import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  category: string;
}

interface ProductState {
  selectedProduct: Product | null;
  filters: {
    category: number | null;
    minPrice: number | null;
    maxPrice: number | null;
    sortBy: "price_asc" | "price_desc" | "name_asc" | "name_desc" | null;
  };
  wishlist: number[];
  recentlyViewed: number[];
}

const initialState: ProductState = {
  selectedProduct: null,
  filters: {
    category: null,
    minPrice: null,
    maxPrice: null,
    sortBy: null,
  },
  wishlist: [],
  recentlyViewed: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<number | null>) => {
      state.filters.category = action.payload;
    },
    setPriceRange: (
      state,
      action: PayloadAction<{ min: number | null; max: number | null }>,
    ) => {
      state.filters.minPrice = action.payload.min;
      state.filters.maxPrice = action.payload.max;
    },
    setSortBy: (
      state,
      action: PayloadAction<ProductState["filters"]["sortBy"]>,
    ) => {
      state.filters.sortBy = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    toggleWishlist: (state, action: PayloadAction<number>) => {
      const index = state.wishlist.indexOf(action.payload);
      if (index === -1) {
        state.wishlist.push(action.payload);
      } else {
        state.wishlist.splice(index, 1);
      }
    },
    addToRecentlyViewed: (state, action: PayloadAction<number>) => {
      // Remove if already exists
      state.recentlyViewed = state.recentlyViewed.filter(
        (id) => id !== action.payload,
      );
      // Add to beginning
      state.recentlyViewed.unshift(action.payload);
      // Keep only last 10 items
      if (state.recentlyViewed.length > 10) {
        state.recentlyViewed.pop();
      }
    },
    clearRecentlyViewed: (state) => {
      state.recentlyViewed = [];
    },
  },
});

export const {
  setSelectedProduct,
  setCategoryFilter,
  setPriceRange,
  setSortBy,
  clearFilters,
  toggleWishlist,
  addToRecentlyViewed,
  clearRecentlyViewed,
} = productSlice.actions;

export const productReducer = productSlice.reducer;
