import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading || !user) return <Navigate to="/sign-in" state={{ from: location }} replace />;
  return children;
}
