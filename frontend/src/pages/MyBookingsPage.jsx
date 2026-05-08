import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  FormControl,
  InputLabel,
  Link as MuiLink,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookingTable } from "../features/bookings";
import { cancelBooking } from "../features/bookings/api/bookingsApi";
import { useBookings } from "../features/bookings/hooks/useBookings";

const DEFAULT_PAGE_SIZE = 10;

export default function MyBookingsPage() {
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [cancellingBookingId, setCancellingBookingId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const query = useMemo(() => {
    const nextQuery = { page, pageSize };
    if (status !== "ALL") {
      nextQuery.status = status;
    }
    return nextQuery;
  }, [page, pageSize, status]);

  const { data, isLoading, error, refetch } = useBookings(query);

  const totalPages = Math.max(
    1,
    Math.ceil((data?.total || 0) / (data?.pageSize || pageSize)),
  );

  async function handleCancel(item) {
    if (!item?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Cancel booking for room ${
        item.classroom?.roomCode || item.classroomId
      }?`,
    );

    if (!confirmed) {
      return;
    }

    setCancellingBookingId(item.id);
    setActionError("");
    setSuccessMessage("");

    try {
      await cancelBooking(item.id);
      setSuccessMessage("Booking cancelled successfully.");
      await refetch();
    } catch (requestError) {
      setActionError(
        requestError?.response?.data?.message ||
          "Failed to cancel booking. Please try again.",
      );
    } finally {
      setCancellingBookingId("");
    }
  }

  return (
    <Container maxWidth="lg">
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <MuiLink
          component={Link}
          underline="hover"
          color="inherit"
          to="/dashboard"
        >
          Dashboard
        </MuiLink>
        <Typography color="text.primary">My Bookings</Typography>
      </Breadcrumbs>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1">
            My Bookings
          </Typography>
          <Typography>
            Track reservations and cancel active entries without losing context.
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => setStatus("ALL")}>
          Show All
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <FormControl>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={status}
            label="Status"
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
              setSuccessMessage("");
              setActionError("");
            }}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isLoading ? (
        <Skeleton variant="rectangular" width="100%" height={400} />
      ) : (
        <BookingTable
          bookings={data?.items || []}
          onCancel={handleCancel}
          cancellingId={cancellingBookingId}
          page={page}
          pageSize={pageSize}
          total={data?.total || 0}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </Container>
  );
}
