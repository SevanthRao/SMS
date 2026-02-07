import { Navigate } from "react-router-dom";
import useAuth from "../auth/useAuth";
import Loader from "./Loader";

/**
 * ProtectedRoute – wraps routes that require authentication.
 * Optionally restricts by role(s).
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>      → any logged-in user
 *   <Route element={<ProtectedRoute roles={["admin"]} />}>  → admin only
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
