import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://pintech-enterprises-98i5.onrender.com/api",
	withCredentials: true, // send cookies to the server
});

export default axiosInstance;
