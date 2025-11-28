import axios, { AxiosHeaders } from "axios";

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

axiosPublic.interceptors.request.use((config) => {
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

axiosPublic.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default axiosPublic;
