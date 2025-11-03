import axios from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosPublic.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default axiosPublic;
