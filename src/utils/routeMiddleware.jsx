import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoutes = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
};

export default ProtectedRoutes;
