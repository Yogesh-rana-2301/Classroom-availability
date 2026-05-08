import { useState } from "react";
import { validateLoginForm } from "../../../shared/forms/validators";
import { Box, Button, TextField } from "@mui/material";

export default function LoginForm({ onSubmit, isLoading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();

    const payload = { email, password };
    const validation = validateLoginForm(payload);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    onSubmit(payload);
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ mt: 1, width: "100%" }}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrors((current) => ({ ...current, email: undefined }));
        }}
        error={Boolean(errors.email)}
        helperText={errors.email || "Use your institutional email address."}
        disabled={isLoading}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrors((current) => ({ ...current, password: undefined }));
        }}
        error={Boolean(errors.password)}
        helperText={errors.password || "Passwords are case-sensitive."}
        disabled={isLoading}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </Box>
  );
}
