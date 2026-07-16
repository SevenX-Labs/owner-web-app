import axios from "axios";
import { API_BASE_URL, API_TIMEOUT_MS, TOKEN_KEY } from "@/constants";
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  timeout: API_TIMEOUT_MS,
});
api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${TOKEN_KEY}=`))
      ?.split("=")[1];
    if (token)
      config.headers.Authorization = `Bearer ${decodeURIComponent(token)}`;
  }
  return config;
});
export const responseData = <T>(response: { data: T }) => response.data;
