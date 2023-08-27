import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import logout from "../utils/logout";

const baseURL = process.env.BACKEND_BASE_URL;

const api = axios.create({
  baseURL,
  timeout: 5000,
});

export default api;

let accessToken = localStorage.getItem("accessToken");
let refreshToken = localStorage.getItem("refreshToken");
const protectedApi = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

protectedApi.interceptors.request.use(async (req) => {
  try {
    if (!accessToken) {
      accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        return;
      }
      req.headers.Authorization = `Bearer ${accessToken}`;
    }
    const user = jwt_decode(accessToken);
    const isAccessTokenExpired = dayjs.unix(user?.exp).diff(dayjs()) < 1;
    console.log("Access token expired: ", isAccessTokenExpired);
    try {
      if (!isAccessTokenExpired) return req;
      
      refreshToken = localStorage.getItem("refreshToken");
      const user = jwt_decode(refreshToken);
      const isRefreshTokenExpired = dayjs.unix(user?.exp).diff(dayjs()) < 1;
      console.log("Refresh token expired: ", isRefreshTokenExpired);

      if (isRefreshTokenExpired) {
        logout();
      }

      var response = await api.post(`/auth/v1/refresh-token/`, {
        refresh: refreshToken?.toString(),
      });
    } catch (err) {
      logout();
    }

    if (response?.status === 200) {
      accessToken = response?.data?.access;
      localStorage.setItem("accessToken", accessToken);
      req.headers.Authorization = `Bearer ${accessToken}`;
      return req;
    }
  } catch (err) {
    console.log("protectedApi: ", err);
  }
});

export { protectedApi };
