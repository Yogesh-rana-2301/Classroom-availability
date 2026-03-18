import { useAuth } from "../app/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <section className="page">
      <h1>Login</h1>
      <p>Use backend auth endpoint and JWT flow in implementation phase.</p>
      <button
        onClick={() => login({ id: "demo", role: "ADMIN", name: "Demo User" })}
      >
        Demo Login (Admin)
      </button>
    </section>
  );
}
