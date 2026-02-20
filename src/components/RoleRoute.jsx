import { Navigate } from "react-router-dom";
import useUserRole from "../hooks/useUserRole";

export default function RoleRoute({ allow, children }) {
  const { role, loading } = useUserRole();

  if (loading) return null;
  if (!allow.includes(role)) return <Navigate to="/dashboard" />;

  return children;
}
