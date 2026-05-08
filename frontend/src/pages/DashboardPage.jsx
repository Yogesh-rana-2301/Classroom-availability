import { Link } from "react-router-dom";
import { Button, Typography, Breadcrumbs } from "@mui/material";

export default function DashboardPage() {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Dashboard</Typography>
      </Breadcrumbs>
      <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 1 }}>
        Dashboard
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Role-aware overview: live availability, quick actions, pending bookings.
      </Typography>
      <Button component={Link} to="/classrooms" variant="contained">
        Browse Rooms
      </Button>
    </>
  );
}
