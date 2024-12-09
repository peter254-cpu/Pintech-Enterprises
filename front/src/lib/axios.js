import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "https://pintech-enterprises-tic6.onrender.com/api",
	withCredentials: true, // send cookies to the server
});

export default axiosInstance;