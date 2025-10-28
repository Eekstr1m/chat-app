import axios from "axios";

export const api = axios.create({
  // TODO: Change to the production URL with /api
  baseURL: import.meta.env.VITE_BACKEND_API,
  // baseURL: "https://74qzhq16-8000.euw.devtunnels.ms/api",
  // baseURL: "http://localhost:8000/api",
  withCredentials: true,
});
