import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "h/api",
	withCredentials: true, // send cookies to the server
});

export default axiosInstance;
