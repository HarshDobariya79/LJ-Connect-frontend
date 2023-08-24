import api from "../services/api";

// Action Types
const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT = "LOGOUT";
const SET_HAS_REFRESH_TOKEN = "SET_HAS_REFRESH_TOKEN";

// Action Creators
export const loginSuccess = (accessToken, refreshToken) => ({
  type: LOGIN_SUCCESS,
  payload: { accessToken, refreshToken },
});

export const logout = () => ({
  type: LOGOUT,
});

export const setHasRefreshToken = (hasToken, refreshToken) => ({
  type: SET_HAS_REFRESH_TOKEN,
  payload: { hasToken, refreshToken },
});

// Thunk Actions
export const sendCodeToServer = (code) => async (dispatch) => {
  try {
    const response = await api.post(process.env.GOOGLE_LOGIN_V1, {
      code,
    });
    const { access, refresh } = response.data;
    dispatch(loginSuccess(access, refresh));
  } catch (error) {
    console.error("Sending code failed:", error);
  }
};

export const renewAccessToken = (refreshToken) => async (dispatch) => {
  try {
    const response = await api.post(process.env.RENEW_ACCESS_TOKEN_V1, {
      refresh: refreshToken,
    });
    const { access } = response.data;
    dispatch(loginSuccess(access, refreshToken));
  } catch (error) {
    console.log('renew access token failed', error);
    dispatch(logout());
  }
};
