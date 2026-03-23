import { useMemo, useState } from "react";
import { cancelBooking } from "../features/bookings/api/bookingsApi";
import { BookingTable } from "../features/bookings";
import { useBookings } from "../features/bookings/hooks/useBookings";
import Button from "../shared/components/Button";

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
    Math.ceil((data.total || 0) / (data.pageSize || pageSize)),
  );
  const hasRows = data.items.length > 0;

  async function handleCancel(item) {
    if (!item?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Cancel booking for room ${item.classroom?.roomCode || item.classroomId}?`,
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
    <section className="page my-bookings-page">
      <h1>My Bookings</h1>
      <p>View your bookings and cancel active reservations.</p>

      <div className="my-bookings-toolbar">
        <label>
          Status
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
              setSuccessMessage("");
              setActionError("");
            }}
          >
            <option value="ALL">All</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>

        <label>
          Page Size
          <select
            value={String(pageSize)}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </label>
      </div>

      {error ? (
        <p className="status-error" role="alert">
          {error}
        </p>
      ) : null}

      {actionError ? (
        <p className="status-error" role="alert">
          {actionError}
        </p>
      ) : null}

      {successMessage ? (
        <p className="status-success" role="status">
          {successMessage}
        </p>
      ) : null}

      {isLoading ? <p>Loading bookings...</p> : null}

      {!isLoading && !hasRows ? (
        <p>No bookings found for this filter.</p>
      ) : null}

      {hasRows ? (
        <div className="my-bookings-table-wrap">
          <BookingTable
            items={data.items}
            onCancel={handleCancel}
            cancellingBookingId={cancellingBookingId}
          />
        </div>
      ) : null}

      <div className="my-bookings-pagination">
        <p>
          Page {page} of {totalPages} | Total bookings: {data.total || 0}
        </p>

        <div className="my-bookings-pagination-actions">
          <Button
            type="button"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Previous
          </Button>

          <Button
            type="button"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
