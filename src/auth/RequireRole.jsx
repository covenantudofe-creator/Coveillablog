import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function RequireRole({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading || !user) return <Navigate to={role === "admin" ? "/admin/login" : "/sign-in"} state={{ from: location }} replace />;
  if (user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/"} replace />;
  return children;
}
