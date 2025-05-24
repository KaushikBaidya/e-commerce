import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
	isLoading: false,
	auctionItems: [],
};

export const placeAuctionBid = createAsyncThunk(
	"cart/placeAuctionBid",
	async ({ userId, auctionId, bidAmount }) => {
		const response = await axios.put(
			"http://localhost:5000/api/shop/auction/place-bid",
			{ userId, auctionId, bidAmount }
		);
		return response.data;
	}
);

export const fetchAuctionItems = createAsyncThunk(
	"cart/fetchAuctionItems",
	async (userId) => {
		const response = await axios.get(
			`http://localhost:5000/api/shop/auction/get/${userId}`
		);
		return response.data;
	}
);

const AuctionSlice = createSlice({
	name: "auctionItems",
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
