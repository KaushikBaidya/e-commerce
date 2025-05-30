import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: true,
  auctionProductList: [],
};

export const addNewAuctionProduct = createAsyncThunk(
  '/auction-products/addNewAuctionProduct',
  async (formdata) => {
    const result = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/admin/products/auction-product/add`,
      formdata,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return result?.data;
  }
);

export const fetchAllAuctionProducts = createAsyncThunk(
  '/auction-products/fetchAllAuctionProducts',
  async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/admin/products/auction-product/get`
    );
    return result?.data;
  }
);

export const editAuctionProduct = createAsyncThunk(
  '/products/editAuctionProduct',
  async ({ id, formData }) => {
    const result = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/admin/products/auction-product/edit/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return result?.data;
  }
);

export const deleteAuctionProduct = createAsyncThunk(
  '/auction-products/deleteAuctionProduct',
  async (id) => {
    const result = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/admin/products/auction-product/delete/${id}`
    );
    return result?.data;
  }
);

const AdminAuctionProductsSlice = createSlice({
  name: 'adminAuctionProducts',
  initialState,
  reducers: {},
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
      });
  },
});

export default AdminAuctionProductsSlice.reducer;
