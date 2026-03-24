import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./app/AuthProvider";
import { ROLES } from "./constants/roles";

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT],
  },
  {
    to: "/classrooms",
    label: "Classrooms",
    roles: [ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT],
  },
  {
    to: "/bookings/my",
    label: "My Bookings",
    roles: [ROLES.ADMIN, ROLES.FACULTY],
  },
  {
    to: "/admin/timetable",
    label: "Timetable Import",
    roles: [ROLES.ADMIN],
  },
  {
    to: "/admin/maintenance",
    label: "Maintenance",
    roles: [ROLES.ADMIN],
  },
  {
    to: "/admin/audit-logs",
    label: "Audit Logs",
    roles: [ROLES.ADMIN],
  },
];

export default function App() {
  const { user, isAuthenticated, isBootstrapping, logout } = useAuth();

  const userRole = user?.role;
  const visibleNavItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <main className="app-shell">
      {isAuthenticated && !isBootstrapping ? (
        <header className="app-header" aria-label="Primary navigation">
          <nav className="app-nav">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `app-nav-link${isActive ? " app-nav-link-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="app-user-menu">
            <span>
              {user?.fullName || user?.name || user?.email || "User"} (
              {userRole})
            </span>
            <button
              type="button"
              onClick={() => {
                logout();
              }}
            >
              Logout
            </button>
          </div>
        </header>
      ) : null}

      <Outlet />
    </main>
  );
}
