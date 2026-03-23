import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";

export default function ProtectedRoute({ roles, children }) {
  const { user, isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <section className="page">
        <p>Loading session...</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
