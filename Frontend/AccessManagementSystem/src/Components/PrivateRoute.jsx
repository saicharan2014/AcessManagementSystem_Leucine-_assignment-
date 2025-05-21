import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "../utils/auth";

const PrivateRoute = ({ allowedRoles }) => {
  const user = isAuthenticated();
  const currentUser = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
