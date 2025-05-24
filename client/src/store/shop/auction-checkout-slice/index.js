import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	checkoutUrl: null, // changed from approvalURL
	isLoading: false,
	orderId: null,
	orderList: [],
	orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
	"/order/createNewOrder",
	async (orderData) => {
		console.log(orderData);

		const response = await axios.post(
			"http://localhost:5000/api/auction/checkout/create",
			orderData
		);
		return response.data;
	}
);

export const getAllOrdersByUserId = createAsyncThunk(
	"/order/getAllOrdersByUserId",
	async (userId) => {
		const response = await axios.get(
			`http://localhost:5000/api/auction/checkout/list/${userId}`
		);
		return response.data;
	}
);

const AuctionCheckoutSlice = createSlice({
	name: "AuctionCheckoutSlice",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(createNewOrder.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createNewOrder.fulfilled, (state, action) => {
				state.isLoading = false;
				state.checkoutUrl = action.payload.checkoutUrl;
				state.orderId = action.payload.orderId;
				sessionStorage.setItem(
					"currentOrderId",
					JSON.stringify(action.payload.orderId)
				);
			})
			.addCase(createNewOrder.rejected, (state) => {
				state.isLoading = false;
				state.checkoutUrl = null;
				state.orderId = null;
			})
			.addCase(getAllOrdersByUserId.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
				state.isLoading = false;
				state.orderList = action.payload.data;
			})
			.addCase(getAllOrdersByUserId.rejected, (state) => {
				state.isLoading = false;
				state.orderList = [];
			});
	},
});

export default AuctionCheckoutSlice.reducer;
