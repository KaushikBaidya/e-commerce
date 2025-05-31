import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  currentPage: 1,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  '/products/fetchAllProducts',
  async ({ filterParams, sortParams, page = 1, limit = 12 }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
      page,
      limit,
    });

    const result = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/shop/products/get?${query}`
    );

    return result?.data;
  }
);

export const fetchProductDetails = createAsyncThunk('/products/fetchProductDetails', async (id) => {
  const result = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/shop/products/get/${id}`);

  return result?.data;
});

const ShoppingProductsSlice = createSlice({
  name: 'shoppingProducts',
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
    resetProducts: (state) => {
      state.productList = [];
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        const newProducts = action.payload.data || [];

        // const fetchedPage = action.meta.arg.page;
        const fetchedPage = action.meta?.arg?.page ?? 1;

        if (fetchedPage === 1) {
          state.productList = newProducts;
        } else {
          state.productList = [...state.productList, ...newProducts];
        }
        state.currentPage = fetchedPage;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails, resetProducts } = ShoppingProductsSlice.actions;

export default ShoppingProductsSlice.reducer;
