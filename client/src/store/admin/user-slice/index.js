import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	isLoading: false,
	userList: [],
	userDetails: null,
};

export const getAllUsers = createAsyncThunk("users/getAllUsers", async () => {
	const response = await axios.get("http://localhost:5000/api/admin/users/get");

	return response.data;
});

const AdminUserSlice = createSlice({
	name: "AdminUserSlice",
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
			});
	},
});

export default AdminUserSlice.reducer;
