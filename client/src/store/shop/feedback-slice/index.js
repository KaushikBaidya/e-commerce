import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: false,
  feedbacks: [],
};

export const addFeedback = createAsyncThunk('/feedback/addFeedback', async (formdata, thunkAPI) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/shop/feedback/add`,
      formdata
    );

    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to add feedback. Try again later.';
    return thunkAPI.rejectWithValue({ success: false, message });
  }
});

export const addUserMessage = createAsyncThunk(
  '/feedback/addUserMessage',
  async (formdata, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/shop/feedback/user-message/add`,
        formdata
      );

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add feedback. Try again later.';
      return thunkAPI.rejectWithValue({ success: false, message });
    }
  }
);

export const getUserFeedbacks = createAsyncThunk('/feedback/getUserFeedbacks', async (userId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/shop/feedback/get/${userId}`
  );

  return response?.data;
});

const feedbackSlice = createSlice({
  name: 'feedbackSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserFeedbacks.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserFeedbacks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.feedbacks = action.payload.data;
    });
    builder.addCase(getUserFeedbacks.rejected, (state) => {
      state.isLoading = false;
      state.feedbacks = [];
    });
  },
});

export default feedbackSlice.reducer;
