import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	notifications: [],
	isLoading: false,
	error: null,
	unreadCount: 0,
};


export const fetchAdminNotifications = createAsyncThunk(
	"adminNotifications/fetchAll",
	async () => {
		const response = await axios.get(
			`${import.meta.env.VITE_API_BASE_URL}/admin/notifications`
		);
		return response.data.notifications;
	}
);

export const markNotificationAsRead = createAsyncThunk(
	"adminNotifications/markAsRead",
	async (id) => {
		const response = await axios.patch(
			`${import.meta.env.VITE_API_BASE_URL}/admin/notifications/${id}/read`
		);
		return response.data.notification;
	}
);

export const deleteAdminNotification = createAsyncThunk(
	"adminNotifications/delete",
	async (id) => {
		await axios.delete(
			`${import.meta.env.VITE_API_BASE_URL}/admin/notifications/${id}`
		);
		return id;
	}
);


const adminNotificationSlice = createSlice({
	name: "adminNotifications",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAdminNotifications.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchAdminNotifications.fulfilled, (state, action) => {
				state.isLoading = false;
				state.notifications = action.payload;
				state.unreadCount = action.payload.filter((n) => !n.read).length;
			})
			.addCase(fetchAdminNotifications.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message;
			})
			.addCase(markNotificationAsRead.fulfilled, (state, action) => {
				const updated = action.payload;
				const index = state.notifications.findIndex(
					(n) => n._id === updated._id
				);
				if (index !== -1) {
					if (!state.notifications[index].read && updated.read) {
						state.unreadCount--;
					}
					state.notifications[index] = updated;
				}
			})
			.addCase(markNotificationAsRead.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(deleteAdminNotification.fulfilled, (state, action) => {
				const id = action.payload;
				const deleted = state.notifications.find((n) => n._id === id);
				state.notifications = state.notifications.filter((n) => n._id !== id);
				if (deleted && !deleted.read) {
					state.unreadCount--;
				}
			})
			.addCase(deleteAdminNotification.rejected, (state, action) => {
				state.error = action.error.message;
			});
	},
});

export default adminNotificationSlice.reducer;
