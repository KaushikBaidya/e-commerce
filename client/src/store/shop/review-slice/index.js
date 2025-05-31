import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk('/order/addReview', async (formdata, thunkAPI) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/shop/review/add`,
      formdata
    );

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to add review. Try again later.';
    return thunkAPI.rejectWithValue({ success: false, message });
  }
});

export const getReviews = createAsyncThunk('/order/getReviews', async (id) => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/shop/review/get/${id}`);

  return response.data;
});

const reviewSlice = createSlice({
  name: 'reviewSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;
