import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./app/AuthProvider";
import { ROLES } from "./constants/roles";
import {
  AppBar,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

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
  const { user, isAuthenticated, isBootstrapping, logout } = useAuth();

  const userRole = user?.role;
  const visibleNavGroups = NAV_GROUPS[userRole] || [];
  const navItems = visibleNavGroups.flatMap((group) => group.items);

  if (!isAuthenticated || isBootstrapping) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main className="app-shell app-shell-guest">
          <Outlet />
        </main>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar component="nav">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              Classroom Availability
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={NavLink}
                  to={item.to}
                  sx={{ color: "#fff" }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Typography sx={{ mr: 2 }}>
              {user?.fullName || user?.name || user?.email || "User"} (
              {userRole})
            </Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ p: 3 }}>
          <Toolbar />
          <Container>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
