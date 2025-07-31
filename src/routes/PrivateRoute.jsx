import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../services/auth";

export default function PrivateRoute() {
  const { isAuthenticated, ready } = useAuth();

  if (!ready) return null; // on bloque le rendu

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}