import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	orderList: [],
	userList: [],
	orderDetails: null,
};

export const getAllUsers = createAsyncThunk("order/getAllUsers", async () => {
	const response = await axios.get(
		"http://localhost:5000/api/admin/orders/users/get"
	);
	return response.data;
});

export const getAllOrdersForAdmin = createAsyncThunk(
	"order/getAllOrdersForAdmin",
	async () => {
		const response = await axios.get(
			"http://localhost:5000/api/admin/orders/get"
		);
		return response.data;
	}
);

export const getAllAuctionOrdersForAdmin = createAsyncThunk(
	"order/getAllAuctionOrdersForAdmin",
	async () => {
		const response = await axios.get(
			"http://localhost:5000/api/admin/orders/auction-order/get"
		);
		return response.data;
	}
);

export const fetchOrderDetailsForAdmin = createAsyncThunk(
	"order/fetchOrderDetailsForAdmin",
	async (id) => {
		const response = await axios.get(
			`http://localhost:5000/api/admin/orders/details/${id}`
		);
		return response.data;
	}
);

export const updateOrderStatus = createAsyncThunk(
	"order/updateOrderStatus",
	async ({ id, orderStatus }) => {
		const response = await axios.put(
			`http://localhost:5000/api/admin/orders/update/${id}`,
			{ orderStatus }
		);
		return response.data;
	}
);

const adminOrderSlice = createSlice({
	name: "adminOrderSlice",
	initialState,
	reducers: {
		resetOrderDetails: (state) => {
			state.orderDetails = null;
		},
	},
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
