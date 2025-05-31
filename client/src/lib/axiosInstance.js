import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Flag to prevent infinite loop
let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and we haven’t retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) return Promise.reject(error);

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.get('/auth/refresh');

        isRefreshing = false;

        // Retry original request after refresh
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
