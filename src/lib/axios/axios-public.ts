import axios, { AxiosHeaders } from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosPublic.interceptors.request.use((config) => {
  const headers = new AxiosHeaders(config.headers);

  const domain = window.location.host;

  headers.set("X-Client-Type", domain);
  config.headers = headers;
  return config;
});

axiosPublic.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default axiosPublic;
