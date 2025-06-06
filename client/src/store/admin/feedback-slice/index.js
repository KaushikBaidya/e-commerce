import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: false,
  feedbacks: [],
  userMessage: [],
};

export const getFeedbacks = createAsyncThunk('/feedback/getFeedbacks', async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/feedback/get`);
  return response.data;
});

export const getUserMessages = createAsyncThunk('/feedback/getUserMessages', async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/admin/feedback/user-message/get`
  );
  return response.data;
});

export const AdminFeedbackSlice = createSlice({
  name: 'adminFeedbackSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedbacks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeedbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feedbacks = action.payload.data;
      })
      .addCase(getFeedbacks.rejected, (state) => {
        state.isLoading = false;
        state.feedbacks = [];
      })
      .addCase(getUserMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userMessage = action.payload.data;
      })
      .addCase(getUserMessages.rejected, (state) => {
        state.isLoading = false;
        state.userMessage = [];
      });
  },
});

export default AdminFeedbackSlice.reducer;
