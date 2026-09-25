import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../../lib/axiosInstance';

const initialState = {
  isLoading: false,
  cartItems: [],
};

// Note: userId is still accepted here so existing call sites don't need to change,
// but the backend now ignores it and always uses the logged-in user from the auth
// cookie (sent automatically by axiosInstance) — this is what actually secures it.
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, productId, quantity }) => {
    const response = await axiosInstance.post('/shop/cart/add', {
      userId,
      productId,
      quantity,
    });
    return response.data;
  }
);

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async (userId) => {
  const response = await axiosInstance.get(`/shop/cart/get/${userId}`);
  return response.data;
});

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async ({ userId, productId }) => {
    const response = await axiosInstance.delete(
      `/shop/cart/delete/${userId}/${productId}`
    );
    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ userId, productId, quantity }) => {
    const response = await axiosInstance.put('/shop/cart/update-cart', {
      userId,
      productId,
      quantity,
    });
    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      });
  },
});

export default shoppingCartSlice.reducer;
