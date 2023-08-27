const initialState = {
  accessToken: null,
  refreshToken: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS": {
      const { accessToken, refreshToken } = action.payload;
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accessToken", accessToken);
      return {
        ...state,
        accessToken,
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
