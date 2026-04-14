import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./app/AuthProvider";
import { ROLES } from "./constants/roles";

const NAV_GROUPS = {
  [ROLES.ADMIN]: [
    {
      id: "core",
      label: "Core",
      items: [
        { to: "/dashboard", label: "Overview" },
        { to: "/classrooms", label: "Rooms" },
        { to: "/bookings/my", label: "Bookings" },
      ],
    },
    {
      id: "admin",
      label: "Admin",
      items: [
        { to: "/admin/timetable", label: "Timetable" },
        { to: "/admin/maintenance", label: "Room Status" },
        { to: "/admin/audit-logs", label: "Audit" },
      ],
    },
  ],
  [ROLES.FACULTY]: [
    {
      id: "core",
      label: "Core",
      items: [
        { to: "/dashboard", label: "Overview" },
        { to: "/classrooms", label: "Rooms" },
        { to: "/bookings/my", label: "Bookings" },
      ],
    },
  ],
  [ROLES.STUDENT]: [
    {
      id: "core",
      label: "Core",
      items: [
        { to: "/dashboard", label: "Overview" },
        { to: "/classrooms", label: "Rooms" },
      ],
    },
  ],
};

export default function App() {
  const location = useLocation();
  const { user, isAuthenticated, isBootstrapping, logout } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const mobileNavRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  const userRole = user?.role;
  const visibleNavGroups = NAV_GROUPS[userRole] || [];
  const flatNavItems = useMemo(
    () => visibleNavGroups.flatMap((group) => group.items),
    [visibleNavGroups],
  );

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileNavOpen || !mobileNavRef.current) {
      return undefined;
    }

    previouslyFocusedRef.current = document.activeElement;
    const focusable = mobileNavRef.current.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    if (focusable.length) {
      focusable[0].focus();
    }

    function handleKeyDown(event) {
      if (!mobileNavRef.current) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setIsMobileNavOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const items = mobileNavRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!items.length) {
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocusedRef.current?.focus) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [isMobileNavOpen]);

  if (!isAuthenticated || isBootstrapping) {
    return (
      <main className="app-shell app-shell-guest">
        <Outlet />
      </main>
    );
  }

  return (
    <main className="app-shell app-shell-auth">
      <a href="#app-main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="app-topbar" aria-label="Application header">
        <div className="app-topbar-left">
          <button
            type="button"
            className="app-menu-toggle"
            onClick={() => setIsMobileNavOpen((current) => !current)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-primary-navigation"
          >
            Menu
          </button>
          <p className="app-brand">Classroom Availability</p>
        </div>

        <nav className="app-top-links" aria-label="Top navigation shortcuts">
          {flatNavItems.slice(0, 3).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `app-top-link${isActive ? " app-top-link-active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="app-user-menu">
          <span>
            {user?.fullName || user?.name || user?.email || "User"} ({userRole})
          </span>
          <button
            type="button"
            className="ca-button ca-button-secondary"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="app-frame">
        <aside className="app-sidebar" aria-label="Primary navigation">
          <nav className="app-nav" aria-label="Role-based navigation">
            {visibleNavGroups.map((group) => (
              <section className="app-nav-group" key={group.id}>
                <p className="app-nav-group-label">{group.label}</p>
                <div className="app-nav-links">
                  {group.items.map((item) => (
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
                </div>
              </section>
            ))}
          </nav>
        </aside>

        <section id="app-main-content" className="app-content" tabIndex={-1}>
          <Outlet />
        </section>
      </div>

      <div
        className={`app-mobile-backdrop${isMobileNavOpen ? " app-mobile-backdrop-open" : ""}`}
        onClick={() => setIsMobileNavOpen(false)}
        aria-hidden={!isMobileNavOpen}
      />

      <aside
        id="mobile-primary-navigation"
        ref={mobileNavRef}
        className={`app-mobile-nav${isMobileNavOpen ? " app-mobile-nav-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="app-mobile-nav-header">
          <p className="app-mobile-nav-title">Navigation</p>
          <button
            type="button"
            className="ca-button ca-button-secondary"
            onClick={() => setIsMobileNavOpen(false)}
          >
            Close
          </button>
        </div>

        <nav className="app-nav" aria-label="Mobile role-based navigation">
          {visibleNavGroups.map((group) => (
            <section className="app-nav-group" key={`mobile-${group.id}`}>
              <p className="app-nav-group-label">{group.label}</p>
              <div className="app-nav-links">
                {group.items.map((item) => (
                  <NavLink
                    key={`mobile-${item.to}`}
                    to={item.to}
                    className={({ isActive }) =>
                      `app-nav-link${isActive ? " app-nav-link-active" : ""}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </nav>
      </aside>
    </main>
  );
}
