import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ThemeProvider,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./app/AuthProvider";
import { ROLES } from "./constants/roles";

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
  typography: {
    // Tell MUI to use responsive font sizes
    htmlFontSize: 16,
    '@media (max-width:600px)': {
      htmlFontSize: 14,
    },
    '@media (min-width:900px)': {
      htmlFontSize: 16,
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => setIsDrawerOpen(false)}
      onKeyDown={() => setIsDrawerOpen(false)}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Menu
        </Typography>
        <IconButton onClick={() => setIsDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.to} component={NavLink} to={item.to}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <AppBar component="nav">
          <Toolbar>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={() => setIsDrawerOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
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
            <Typography sx={{ mr: 2, display: { xs: "none", md: "block" } }}>
              {user?.fullName || user?.name || user?.email || "User"} (
              {userRole})
            </Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        >
          {drawerContent}
        </Drawer>
        <Box component="main" sx={{ p: 3, width: "100%" }}>
          <Toolbar />
          <Container>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
