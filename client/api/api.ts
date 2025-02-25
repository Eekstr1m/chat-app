import axios from "axios";

export const api = axios.create({
  // TODO: Change to the production URL with /api
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
