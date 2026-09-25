import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../../lib/axiosInstance';

const initialState = {
  isLoading: false,
  addressList: [],
};

export const addNewAddress = createAsyncThunk('/address/addnewaddress', async (formdata) => {
  const response = await axiosInstance.post('/shop/address/add', formdata);
  return response?.data;
});

export const fetchAllAddresses = createAsyncThunk('/address/fetchAllAddresses', async (userId) => {
  const response = await axiosInstance.get(`/shop/address/get/${userId}`);
  return response?.data;
});

export const editAddress = createAsyncThunk(
  '/address/editAddress',
  async ({ userId, addressId, formData }) => {
    const response = await axiosInstance.put(
      `/shop/address/update/${userId}/${addressId}`,
      formData
    );
    return response?.data;
  }
);

export const deleteAddress = createAsyncThunk(
  '/addresses/deleteAddress',
  async ({ userId, addressId }) => {
    const response = await axiosInstance.delete(
      `/shop/address/delete/${userId}/${addressId}`
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
