import axios from "axios";
import { addPublicHeaders } from "./axios-helpers";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// ✅ Chỉ thêm header phụ (không token)
axiosPublic.interceptors.request.use(addPublicHeaders, (error) =>
  Promise.reject(error)
);

axiosPublic.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default axiosPublic;
