import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import ProtectedRoutes from "./utils/routeMiddleware";
import store from "./store";
import { AuthProvider } from "./hooks/useAuth";
import Auth from "./pages/Auth/Auth";
import { useAuth } from "./hooks/useAuth";

const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="/home" element={<Home />}>
          <Route path="" element={<div>This is Home</div>} />
        </Route>
      </Route>
      <Route path="/" element={<Auth />} exact />
      <Route
        path="/login"
        element={!isLoggedIn ? <Login /> : <Navigate to="/home" />}
      />
      <Route path="*" element={<div>Invalid path</div>} />
    </Routes>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </Provider>
);
