import type { InternalAxiosRequestConfig } from "axios";
import { COOKIE_KEYS } from "@/constants";
import { accessTokenStore } from "@/stores/auth";
import { getCookie } from "@/utils/cookie";

/**
 * ✅ Thêm token + header phụ trước mỗi request (dùng cho axiosPrivate)
 * - Lấy access token từ cookie
 * - Thêm ngôn ngữ, timezone
 */
export const addTokensBeforeRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  try {
    const accessToken = accessTokenStore.get();

    const accessTokenCookie = getCookie(COOKIE_KEYS.at);

    // 🔥 Nếu có access token → gắn Bearer
    if (accessToken) {
      config.headers.Authorization = `Bearer ${
        accessToken || accessTokenCookie
      }`;
    }

    return config;
  } catch (error) {
    console.error("❌ addTokensBeforeRequest error:", error);
    return config;
  }
};

/**
 * ✅ Thêm header cơ bản (dùng cho axiosPublic)
 * - Không thêm token, chỉ thêm ngôn ngữ + timezone
 */
export const addPublicHeaders = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  try {
    return config;
  } catch (error) {
    console.error("❌ addPublicHeaders error:", error);
    return config;
  }
};
