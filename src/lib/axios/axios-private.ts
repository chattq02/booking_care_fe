import axios from "axios";
import { addTokensBeforeRequest } from "./axios-helpers";

const axiosWithToken = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // ✅ gửi cookie cùng request
});

axiosWithToken.interceptors.request.use(
  (config) => addTokensBeforeRequest(config),
  (error) => Promise.reject(error)
);
// ❌ Không tự set Content-Type ở đây
axiosWithToken.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Xử lý refresh token khi 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        return axiosWithToken(originalRequest);
      } catch (refreshErr) {
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosWithToken;
