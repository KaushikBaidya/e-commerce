import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  orderList: [],
  orderDetails: null,
};

export const getAllOrdersForAdmin = createAsyncThunk('order/getAllOrdersForAdmin', async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/orders/get`);
  return response.data;
});

export const getAllAuctionOrdersForAdmin = createAsyncThunk(
  'order/getAllAuctionOrdersForAdmin',
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/admin/orders/auction-order/get`
    );
    return response.data;
  }
);

export const fetchOrderDetailsForAdmin = createAsyncThunk(
  'order/fetchOrderDetailsForAdmin',
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/admin/orders/details/${id}`
    );
    return response.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ id, orderStatus }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/admin/orders/update/${id}`,
      { orderStatus }
    );
    return response.data;
  }
);

const adminOrderSlice = createSlice({
  name: 'adminOrderSlice',
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getAllAuctionOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAuctionOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllAuctionOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(fetchOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(fetchOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
