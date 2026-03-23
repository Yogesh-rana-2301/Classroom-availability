import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../App";
import { useAuth } from "./AuthProvider";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import ClassroomsPage from "../pages/ClassroomsPage";
import RoomAvailabilityPage from "../pages/RoomAvailabilityPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import AdminTimetablePage from "../pages/AdminTimetablePage";
import AdminMaintenancePage from "../pages/AdminMaintenancePage";
import AdminAuditLogsPage from "../pages/AdminAuditLogsPage";
import NotFoundPage from "../pages/NotFoundPage";

function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <section className="page">
        <p>Loading session...</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "/login", element: <LoginPage /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/classrooms",
        element: (
          <ProtectedRoute>
            <ClassroomsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/classrooms/:id/availability",
        element: (
          <ProtectedRoute>
            <RoomAvailabilityPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/bookings/my",
        element: (
          <ProtectedRoute roles={["ADMIN", "FACULTY"]}>
            <MyBookingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/timetable",
        element: (
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminTimetablePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/maintenance",
        element: (
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminMaintenancePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/audit-logs",
        element: (
          <ProtectedRoute roles={["ADMIN"]}>
            <AdminAuditLogsPage />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
