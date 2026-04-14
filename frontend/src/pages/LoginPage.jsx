import { useState } from "react";
import { useAuth } from "../app/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { LoginForm } from "../features/auth";
import { TextSkeleton } from "../shared/components/LoadingSkeleton";

export default function LoginPage() {
  const { login, isAuthenticated, isBootstrapping } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (isBootstrapping) {
    return (
      <section className="page">
        <h1>Login</h1>
        <p className="status-info" role="status">
          Checking your session...
        </p>
        <TextSkeleton lines={3} label="Checking session state" />
      </section>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleLogin(credentials) {
    setIsLoading(true);
    setError("");

    try {
      await login(credentials);
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message ||
        "Unable to sign in. Please check your credentials and try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="page">
      <h1>Login</h1>
      <p>Sign in with your institutional account.</p>
      {error ? (
        <p className="status-error" role="alert">
          {error}
        </p>
      ) : null}
      {isLoading ? (
        <p className="status-info" role="status">
          Authenticating account...
        </p>
      ) : null}
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </section>
  );
}
