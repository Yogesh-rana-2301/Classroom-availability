import { Link, Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <header>
        <nav>
          <Link to="/dashboard">Dashboard</Link> |{" "}
          <Link to="/classrooms">Classrooms</Link> |{" "}
          <Link to="/bookings/my">My Bookings</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
