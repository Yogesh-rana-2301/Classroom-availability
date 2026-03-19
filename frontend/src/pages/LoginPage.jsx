import { useAuth } from "../app/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleDemoLogin() {
    login({ id: "demo", role: "ADMIN", name: "Demo User" });
    navigate("/dashboard", { replace: true });
  }

  return (
    <section className="page">
      <h1>Login</h1>
      <p>Use backend auth endpoint and JWT flow in implementation phase.</p>
      <button onClick={handleDemoLogin}>Demo Login (Admin)</button>
    </section>
  );
}
