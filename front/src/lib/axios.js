import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "https://pintech-enterprises-zhpb.onrender.com/api",
	withCredentials: true, // send cookies to the server
});

export default axiosInstance;
