import axios from "axios";

const api = axios.create({
  baseURL: process.env.BACKEND_BASE_URL,
});

export default api;
