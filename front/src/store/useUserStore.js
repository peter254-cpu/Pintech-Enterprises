import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

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
      console.log(error)
      toast.error(
        error.response?.data?.message || "An error occurred during signup"
      );
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      console.log(res.data)
      set({ user: res.data, loading: false });

    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response.data.message || "An error occured during login"
      );
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true })
    try {
      const response = await axios.get("/auth/profile")
      console.log(response.data)
      set({ user: response.data, checkingAuth: false })

    } catch (error) {
      set({ checkingAuth: false, user: null })
      console.log(error.message)
    }
  },
  logout: async () => {
    try {
      await axios.post("/auth/logout")
      set({ user: null })
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occured during logout"
      )
    }
  },
  refreshToken: async () => {
    //Prevent multiple simutaneous refresh attempts
    if (get().checkingAuth) return
    set({ checkingAuth: true })
    try {
      const response = await axios.post("/auth/refresh-token")
      set({ checkAuth: true })
      return response.data
    } catch (error) {
      set({ user: null, checkingAuth: false })
      throw error
    }
  }
}));
//Implement the axios interceptors for refreshing access token


//Axios interceptors for token refresh
let refreshPromise = null

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        //if a refresh in already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise
          return axios(originalRequest)
        }

        //start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken()
        await refreshPromise
        refreshPromise = null
        return axios(originalRequest)
      } catch (refreshError) {
        //if refresh fails redirect to login or handle as needed
        useUserStore.getState().logout()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)
