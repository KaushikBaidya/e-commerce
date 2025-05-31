import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: false,
  auctionItems: [],
};

export const placeAuctionBid = createAsyncThunk(
  'cart/placeAuctionBid',
  async ({ userId, auctionId, bidAmount }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/shop/auction/place-bid`,
      { userId, auctionId, bidAmount }
    );
    return response.data;
  }
);

export const fetchAuctionItems = createAsyncThunk('cart/fetchAuctionItems', async (userId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/shop/auction/get/${userId}`
  );
  return response.data;
});

const AuctionSlice = createSlice({
  name: 'auctionItems',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuctionItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAuctionItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auctionItems = action.payload.data;
      })
      .addCase(fetchAuctionItems.rejected, (state) => {
        state.isLoading = false;
        state.auctionItems = [];
      })
      .addCase(placeAuctionBid.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(placeAuctionBid.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auctionItems = action.payload.data;
      })
      .addCase(placeAuctionBid.rejected, (state) => {
        state.isLoading = false;
        state.auctionItems = [];
      });
  },
});

export default AuctionSlice.reducer;
