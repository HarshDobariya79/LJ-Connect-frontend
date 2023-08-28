import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import ProtectedRoutes from "./utils/routeMiddleware";
import { AuthProvider } from "./hooks/useAuth";
import Auth from "./pages/Auth/Auth";
import { useAuth } from "./hooks/useAuth";

const App = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route
        element={isLoggedIn ? <ProtectedRoutes /> : <Navigate to="/login" />}
      >
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="" element={<div>This is Dashboard</div>} />
        </Route>
      </Route>
      <Route path="/" element={<Auth />} exact />
      <Route
        path="/login"
        element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route path="*" element={<div>Invalid path</div>} />
    </Routes>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
    <Router>
      <App />
    </Router>
  </AuthProvider>
);
