import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  notifications: [],
  isLoading: false,
  error: null,
  unreadCount: 0,
};

export const fetchAdminNotifications = createAsyncThunk(
  'adminNotifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/notifications`);
      const notifications = response?.data?.data;
      if (!Array.isArray(notifications)) {
        throw new Error('Invalid response format');
      }
      return notifications;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'adminNotifications/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/admin/notifications/${id}/read`
      );
      console.log('===>', response?.data);

      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'adminNotifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/admin/notifications/read-all`);
      return true; // simple success flag
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAdminNotification = createAsyncThunk(
  'adminNotifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/admin/notifications/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAllAdminNotifications = createAsyncThunk(
  'adminNotifications/deleteAll',
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/admin/notifications/delete-all`);
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const adminNotificationSlice = createSlice({
  name: 'adminNotifications',
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
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      })
      .addCase(fetchAdminNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.notifications.findIndex((n) => n._id === updated._id);
        if (index !== -1) {
          if (!state.notifications[index].isRead && updated.isRead) {
            state.unreadCount--;
          }
          state.notifications[index] = updated;
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.unreadCount = 0;
      })
      .addCase(deleteAdminNotification.fulfilled, (state, action) => {
        const id = action.payload;
        const deleted = state.notifications.find((n) => n._id === id);
        state.notifications = state.notifications.filter((n) => n._id !== id);
        if (deleted && !deleted.isRead) {
          state.unreadCount--;
        }
      })
      .addCase(deleteAdminNotification.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteAllAdminNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
      })
      .addCase(deleteAllAdminNotifications.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default adminNotificationSlice.reducer;
