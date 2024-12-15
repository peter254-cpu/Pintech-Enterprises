import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://pintech-enterprises-5vvi.onrender.com/api/products/featured/api",
	withCredentials: true, // send cookies to the server
});

export default axiosInstance;