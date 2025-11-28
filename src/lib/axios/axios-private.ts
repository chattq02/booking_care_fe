import { accessTokenStore } from "@/stores/auth";
import axios, { AxiosHeaders } from "axios";
import { clearTokens, saveCookies } from "../actions/auth";

const axiosWithToken = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // ✅ gửi cookie cùng request
});

axiosWithToken.interceptors.request.use((config) => {
  const headers = new AxiosHeaders(config.headers);

  const host = window.location.host;
  const currentUrl = window.location.hostname;

  let clientType = "user";
  if (host.includes("admin")) clientType = "admin";
  else if (host.includes("doctor")) clientType = "doctor";

  headers.set("X-Client-Type", clientType);
  headers.set("X-Current-Url", currentUrl);
  config.headers = headers;
  return config;
});

// ❌ Không tự set Content-Type ở đây
axiosWithToken.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    // những api không cần check
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/logout") ||
      originalRequest.url.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // ✅ Nếu API /me trả về 404 → về trang login
    if (
      error.response?.status === 404 &&
      (originalRequest.url.includes("/auth/me") ||
        originalRequest.url.includes("/auth/refresh-token"))
    ) {
      clearTokens();
      // window.location.replace("/login");
      return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (error.response?.status === 401 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1;

      try {
        const res = await axiosWithToken.post("/auth/refresh-token");
        const newAccessToken = res.data.access_token;
        accessTokenStore.set(newAccessToken);
        saveCookies({
          at: String(newAccessToken),
          atbMaxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
        return axiosWithToken(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.location.replace("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosWithToken;
