import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: false,
  addressList: [],
};

export const addNewAddress = createAsyncThunk('/address/addnewaddress', async (formdata) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/shop/address/add`,
    formdata
  );
  return response?.data;
});

export const fetchAllAddresses = createAsyncThunk('/address/fetchAllAddresses', async (userId) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/shop/address/get/${userId}`
  );
  return response?.data;
});

export const editAddress = createAsyncThunk(
  '/address/editAddress',
  async ({ userId, addressId, formData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/shop/address/update/${userId}/${addressId}`,
      formData
    );
    return response?.data;
  }
);

export const deleteAddress = createAsyncThunk(
  '/addresses/deleteAddress',
  async ({ userId, addressId }) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/shop/address/delete/${userId}/${addressId}`
    );

    return response.data;
  }
);

export const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      });
  },
});

export default addressSlice.reducer;
