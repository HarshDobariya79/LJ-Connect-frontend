const initialState = {
  accessToken: null,
  refreshToken: null,
  hasRefreshToken: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS": {
      const { accessToken, refreshToken } = action.payload;
      localStorage.setItem("refreshToken", refreshToken);
      return {
        ...state,
        accessToken,
        refreshToken,
        hasRefreshToken: true,
      };
    }
    case "SET_HAS_REFRESH_TOKEN": {
      const { hasToken, refreshToken } = action.payload;
      return {
        ...state,
        hasRefreshToken: hasToken,
        refreshToken,
      };
    }
    case "LOGOUT": {
      localStorage.clear();
      return initialState;
    }
    default:
      return state;
  }
};

export default authReducer;
