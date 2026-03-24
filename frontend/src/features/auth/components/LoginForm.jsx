import { useState } from "react";
import FieldError from "../../../shared/feedback/FieldError";
import FormErrorSummary from "../../../shared/feedback/FormErrorSummary";
import { validateLoginForm } from "../../../shared/forms/validators";

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
    <form onSubmit={handleSubmit} noValidate>
      <FormErrorSummary errors={errors} />

      <label className="form-field">
        Email
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((current) => ({ ...current, email: undefined }));
          }}
          type="email"
          disabled={isLoading}
          required
        />
        <FieldError message={errors.email} />
      </label>

      <label className="form-field">
        Password
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((current) => ({ ...current, password: undefined }));
          }}
          type="password"
          disabled={isLoading}
          required
        />
        <FieldError message={errors.password} />
      </label>

      <button disabled={isLoading} type="submit">
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
