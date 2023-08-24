import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setHasRefreshToken,
  renewAccessToken,
} from "./actions/authActions.js";
import store from "./store";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      dispatch(setHasRefreshToken(true, refreshToken));
      dispatch(renewAccessToken(refreshToken));
    }
  }, []);

  const { hasRefreshToken } = useSelector((state) => state.auth);

  return <>{hasRefreshToken ? <Home /> : <Login />}</>;
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
