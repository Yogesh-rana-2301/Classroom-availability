import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchClassrooms } from "../features/availability/api/availabilityApi";
import { toggleClassroomMaintenance } from "../features/admin/api/adminApi";
import { MaintenanceSwitch } from "../features/admin";
import TextInput from "../shared/forms/TextInput";
import Button from "../shared/components/Button";
import { TableSkeleton } from "../shared/components/LoadingSkeleton";
import PageHeader from "../shared/components/PageHeader";
import DataTable from "../shared/table/DataTable";

const DEFAULT_PAGE_SIZE = 20;

export default function AdminMaintenancePage() {
  const [search, setSearch] = useState("");
  const [building, setBuilding] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingToggles, setPendingToggles] = useState({});

  const query = useMemo(() => {
    const nextQuery = { page, pageSize };

    if (search.trim()) {
      nextQuery.search = search.trim();
    }

    if (building.trim()) {
      nextQuery.building = building.trim();
    }

    if (statusFilter === "MAINTENANCE") {
      nextQuery.isMaintenance = true;
    }

    if (statusFilter === "ACTIVE") {
      nextQuery.isMaintenance = false;
    }

    return nextQuery;
  }, [building, page, pageSize, search, statusFilter]);

  const loadRooms = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetchClassrooms(query);
      setData({
        items: response?.items || [],
        total: response?.total || 0,
        page: response?.page || page,
        pageSize: response?.pageSize || pageSize,
      });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to load classrooms for maintenance control.",
      );
      setData((current) => ({ ...current, items: [], total: 0 }));
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, query]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const totalPages = Math.max(
    1,
    Math.ceil((data.total || 0) / (data.pageSize || pageSize)),
  );

  const columns = [
    { key: "room", label: "Room", sortable: true },
    { key: "building", label: "Building", sortable: true },
    { key: "capacity", label: "Capacity", sortable: true },
    { key: "facilities", label: "Facilities", sortable: true },
    { key: "maintenance", label: "Maintenance" },
  ];

  const rows = data.items.map((room) => ({
    id: room.id,
    room: room.roomCode,
    building: room.building || "-",
    capacity: room.capacity ?? "-",
    facilities:
      Array.isArray(room.facilities) && room.facilities.length
        ? room.facilities.join(", ")
        : "-",
    maintenance: (
      <MaintenanceSwitch
        value={room.isMaintenance}
        onChange={(nextValue) => handleToggle(room, nextValue)}
        isLoading={Boolean(pendingToggles[room.id])}
        disabled={isLoading}
      />
    ),
  }));

  async function handleToggle(room, nextValue) {
    if (!room?.id) {
      return;
    }

    const roomId = room.id;
    setError("");
    setSuccessMessage("");
    setPendingToggles((current) => ({ ...current, [roomId]: true }));

    const previousValue = Boolean(room.isMaintenance);

    // Optimistic update for responsive toggling.
    setData((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === roomId ? { ...item, isMaintenance: nextValue } : item,
      ),
    }));

    try {
      const response = await toggleClassroomMaintenance(roomId, nextValue);
      const updated = response?.classroom;

      setData((current) => ({
        ...current,
        items: current.items.map((item) =>
          item.id === roomId
            ? {
                ...item,
                isMaintenance: Boolean(updated?.isMaintenance ?? nextValue),
              }
            : item,
        ),
      }));

      setSuccessMessage(
        `${room.roomCode} marked as ${nextValue ? "under maintenance" : "active"}.`,
      );
    } catch (requestError) {
      setData((current) => ({
        ...current,
        items: current.items.map((item) =>
          item.id === roomId ? { ...item, isMaintenance: previousValue } : item,
        ),
      }));

      setError(
        requestError?.response?.data?.message ||
          "Failed to update maintenance status. Please retry.",
      );
    } finally {
      setPendingToggles((current) => {
        const next = { ...current };
        delete next[roomId];
        return next;
      });
    }
  }

  function clearFilters() {
    setSearch("");
    setBuilding("");
    setStatusFilter("ALL");
    setPage(1);
    setPageSize(DEFAULT_PAGE_SIZE);
  }

  return (
    <section className="page admin-maintenance-page">
      <PageHeader
        title="Room Maintenance"
        description="Adjust room status with filters and fast row-level updates."
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Admin" },
          { label: "Room Maintenance" },
        ]}
        meta={`Page ${page} of ${totalPages}`}
        actions={
          <Button type="button" variant="secondary" onClick={clearFilters}>
            Reset Filters
          </Button>
        }
      />

      <section className="page-panel" aria-label="Maintenance filters">
        <h2 className="page-panel-title">Filter Rooms</h2>
        <div className="admin-maintenance-toolbar data-filters">
          <label>
            Search
            <TextInput
              type="search"
              placeholder="Room code or building"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </label>

          <label>
            Building
            <TextInput
              type="text"
              placeholder="Main Block"
              value={building}
              onChange={(event) => {
                setBuilding(event.target.value);
                setPage(1);
              }}
            />
          </label>

          <label>
            Status
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All</option>
              <option value="ACTIVE">Active Rooms</option>
              <option value="MAINTENANCE">Maintenance Only</option>
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

          <div className="admin-maintenance-toolbar-actions">
            <p className="filter-help-text">
              Use reset in the header to clear all filters.
            </p>
          </div>
        </div>
      </section>

      <section className="page-panel" aria-live="polite" aria-busy={isLoading}>
        <h2 className="page-panel-title">Results</h2>

        {error ? (
          <p className="status-error" role="alert">
            {error}
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
              Loading room maintenance data...
            </p>
            <div className="admin-maintenance-table-wrap data-table-wrap">
              <TableSkeleton
                rows={6}
                columns={5}
                label="Loading maintenance table"
              />
            </div>
          </>
        ) : (
          <div className="admin-maintenance-table-wrap data-table-wrap">
            <DataTable
              columns={columns}
              rows={rows}
              emptyMessage="No classrooms found for the selected filters."
            />
          </div>
        )}

        <div className="admin-maintenance-pagination data-pagination">
          <p>
            Page {page} of {totalPages} | Total rooms: {data.total || 0} | Sort
            via table headers
          </p>

          <div className="admin-maintenance-pagination-actions data-pagination-actions">
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
