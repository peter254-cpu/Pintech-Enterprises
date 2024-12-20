import axios from "axios";

const axiosInstance = axios.create({
<<<<<<< HEAD
	baseURL: "h/api",
=======
	baseURL: "https://pintech-enterprises-98i5.onrender.com/api",
>>>>>>> a97250a2fdb7eaffa11693593ef4e17f09ab8d87
	withCredentials: true, // send cookies to the server
});

export default axiosInstance;
