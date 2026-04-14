import { useMemo, useState } from "react";
import { cancelBooking } from "../features/bookings/api/bookingsApi";
import { BookingTable } from "../features/bookings";
import { useBookings } from "../features/bookings/hooks/useBookings";
import Button from "../shared/components/Button";
import { TableSkeleton } from "../shared/components/LoadingSkeleton";
import PageHeader from "../shared/components/PageHeader";

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
      <PageHeader
        title="My Bookings"
        description="Track reservations and cancel active entries without losing context."
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "My Bookings" },
        ]}
        meta={`Page ${page} of ${totalPages}`}
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStatus("ALL")}
          >
            Show All
          </Button>
        }
      />

      <section className="page-panel" aria-label="Booking filters">
        <h2 className="page-panel-title">Filter Bookings</h2>
        <div className="my-bookings-toolbar data-filters">
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
      </section>

      <section className="page-panel" aria-live="polite" aria-busy={isLoading}>
        <h2 className="page-panel-title">Results</h2>

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

        {isLoading ? (
          <>
            <p className="status-info" role="status">
              Loading your bookings...
            </p>
            <div className="my-bookings-table-wrap data-table-wrap">
              <TableSkeleton rows={6} columns={6} label="Loading bookings" />
            </div>
          </>
        ) : (
          <div className="my-bookings-table-wrap data-table-wrap">
            <BookingTable
              items={data.items}
              onCancel={handleCancel}
              cancellingBookingId={cancellingBookingId}
            />
          </div>
        )}

        <div className="my-bookings-pagination data-pagination">
          <p>
            Page {page} of {totalPages} | Total bookings: {data.total || 0} |
            Sort via table headers
          </p>

          <div className="my-bookings-pagination-actions data-pagination-actions">
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
    </section>
  );
}
