import { useState } from "react";
import { useAuth } from "../app/AuthProvider";
import { Navigate, useNavigate } from "react-router-dom";
import { LoginForm } from "../features/auth";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";

export default function LoginPage() {
  const { login, isAuthenticated, isBootstrapping } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (isBootstrapping) {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <p className="status-info" role="status">
            Checking your session...
          </p>
          <CircularProgress />
        </Box>
      </Container>
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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Typography component="p" sx={{ mt: 1 }}>
          Sign in with your institutional account.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {error}
          </Alert>
        )}
        {isLoading && <CircularProgress sx={{ mt: 2 }} />}
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </Box>
    </Container>
  );
}
