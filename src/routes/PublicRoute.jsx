import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../services/auth";

export default function PublicRoute() {
  const { isAuthenticated, ready } = useAuth();

  if (!ready) return null;

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />;
}