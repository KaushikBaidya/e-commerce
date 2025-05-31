import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: false,
  userList: [],
  userDetails: null,
};

export const getAllUsers = createAsyncThunk('users/getAllUsers', async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/users/get`);

  return response.data;
});

export const getUsersDetails = createAsyncThunk('users/getUsersDetails', async (id) => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/users/get/${id}`);

  return response.data;
});

const AdminUserSlice = createSlice({
  name: 'AdminUserSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload.data;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isLoading = false;
        state.userList = [];
      })
      .addCase(getUsersDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsersDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload.data;
      })
      .addCase(getUsersDetails.rejected, (state) => {
        state.isLoading = false;
        state.userDetails = null;
      });
  },
});

export default AdminUserSlice.reducer;
