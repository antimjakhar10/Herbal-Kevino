import axios from "axios";

const RAW_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API_HOST = RAW_BASE_URL.replace(/\/$/, "");

export const API = `${API_HOST}/api`;

export const api = axios.create({
  baseURL: API,
});

export const getImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http")) return path;

  const cleanPath = path.replace(/\\/g, "/").replace(/^\/+/, "");

  if (cleanPath.startsWith("uploads/")) {
    return `${API_HOST}/${cleanPath}`;
  }

  return `${API_HOST}/${cleanPath}`;
};