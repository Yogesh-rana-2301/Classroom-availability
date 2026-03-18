import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <main className="app-shell">
      <Outlet />
    </main>
  );
}
