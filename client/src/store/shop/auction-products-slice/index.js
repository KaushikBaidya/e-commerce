import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: false,
  auctionProductList: [],
  auctionProductDetails: null,
};

export const fetchAllAuctionProducts = createAsyncThunk(
  '/auction-products/fetchAllAuctionProducts',
  async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/shop/products/auction-product/get`
    );
    return result?.data;
  }
);

export const fetchAuctionProductDetails = createAsyncThunk(
  '/products/fetchAuctionProductDetails',
  async (id) => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/shop/products/auction-product/get/${id}`
    );

    return result?.data;
  }
);

const ShoppingAuctionProductsSlice = createSlice({
  name: 'shoppingAuctionProducts',
  initialState,
  reducers: {
    resetAuctionProductDetails: (state) => {
      state.auctionProductDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAuctionProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAuctionProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auctionProductList = action.payload.data;
      })
      .addCase(fetchAllAuctionProducts.rejected, (state) => {
        state.isLoading = false;
        state.auctionProductList = [];
      })
      .addCase(fetchAuctionProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAuctionProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auctionProductDetails = action.payload.data;
      })
      .addCase(fetchAuctionProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.auctionProductDetails = null;
      });
  },
});

export const { resetAuctionProductDetails } = ShoppingAuctionProductsSlice.actions;

export default ShoppingAuctionProductsSlice.reducer;
