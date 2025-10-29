import type { InternalAxiosRequestConfig } from "axios";
import { getCookie } from "@/utils/cookie";
import { COOKIE_KEYS, HEADER_KEYS } from "@/constants";
import { getTimezone } from "@/utils/time";

/**
 * ✅ Thêm token + header phụ trước mỗi request (dùng cho axiosPrivate)
 * - Lấy access token từ cookie
 * - Thêm ngôn ngữ, timezone
 */
export const addTokensBeforeRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  try {
    const accessToken = getCookie(COOKIE_KEYS.at);
    const language = getCookie(COOKIE_KEYS.lng) || "vi";
    const timezone = getTimezone();

    // 🔥 Nếu có access token → gắn Bearer
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // ✅ Thêm header phụ
    config.headers[HEADER_KEYS.language] = language;
    config.headers[HEADER_KEYS.timezone] = timezone;

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
    const language = getCookie(COOKIE_KEYS.lng) || "vi";
    const timezone = getTimezone();

    config.headers[HEADER_KEYS.language] = language;
    config.headers[HEADER_KEYS.timezone] = timezone;

    return config;
  } catch (error) {
    console.error("❌ addPublicHeaders error:", error);
    return config;
  }
};
