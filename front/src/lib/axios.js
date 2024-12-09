import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://pintech-enterprises-tic6.onrender.com/",
	withCredentials: true, // send cookies to the server
});

export default axiosInstance;