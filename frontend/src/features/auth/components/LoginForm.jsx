import { useState } from "react";
import FieldError from "../../../shared/feedback/FieldError";
import FormErrorSummary from "../../../shared/feedback/FormErrorSummary";
import TextInput from "../../../shared/forms/TextInput";
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
    <form className="form-layout" onSubmit={handleSubmit} noValidate>
      <FormErrorSummary errors={errors} />

      <label className="form-field" htmlFor="login-email">
        <span className="form-label">Email</span>
        <TextInput
          id="login-email"
          className={errors.email ? "form-input-invalid" : ""}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((current) => ({ ...current, email: undefined }));
          }}
          type="email"
          placeholder="name@institution.edu"
          disabled={isLoading}
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={
            errors.email ? "login-email-error" : "login-email-help"
          }
        />
        <span id="login-email-help" className="form-helper">
          Use your institutional email address.
        </span>
        <FieldError id="login-email-error" message={errors.email} />
      </label>

      <label className="form-field" htmlFor="login-password">
        <span className="form-label">Password</span>
        <TextInput
          id="login-password"
          className={errors.password ? "form-input-invalid" : ""}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((current) => ({ ...current, password: undefined }));
          }}
          type="password"
          placeholder="Enter your password"
          disabled={isLoading}
          required
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? "login-password-error" : "login-password-help"
          }
        />
        <span id="login-password-help" className="form-helper">
          Passwords are case-sensitive.
        </span>
        <FieldError id="login-password-error" message={errors.password} />
      </label>

      <button className="form-submit" disabled={isLoading} type="submit">
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
