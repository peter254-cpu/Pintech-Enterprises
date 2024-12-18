import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  refreshPromise: null, // Track the refresh promise to avoid multiple refresh attempts

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });
    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }
    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data?.user, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred during signup");
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      set({ user: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "An error occurred during login");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response?.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
      console.log(error.message);
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during logout");
    }
  },

  refreshToken: () => {
    const { refreshPromise } = get();
    if (refreshPromise) {
      // Prevent new refresh request if one is already in progress
      return refreshPromise;
    }

    // Start a new refresh request, but do not use async in the executor
    const newRefreshPromise = new Promise((resolve, reject) => {
      axios
        .post("/auth/refresh-token")
        .then((response) => {
          set({ user: response.data, checkingAuth: false });
          resolve(response.data);
        })
        .catch((error) => {
          set({ user: null, checkingAuth: false });
          reject(error);
        })
        .finally(() => {
          set({ refreshPromise: null }); // Reset refresh promise after completion
        });
    });

    set({ refreshPromise: newRefreshPromise });
    return newRefreshPromise;
  }
}));

// Axios interceptors for token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;  // Wait for token refresh to complete
        return axios(originalRequest);  // Retry the original request
      } catch (refreshError) {
        useUserStore.getState().logout();  // Logout on refresh failure
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
