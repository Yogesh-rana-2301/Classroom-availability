import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAvailability } from "../features/availability/hooks/useAvailability";
import DataTable from "../shared/table/DataTable";
import Button from "../shared/components/Button";
import PageHeader from "../shared/components/PageHeader";
import { TableSkeleton } from "../shared/components/LoadingSkeleton";
import TextInput from "../shared/forms/TextInput";

const DEFAULT_PAGE_SIZE = 10;

function normalizeNumber(value) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

function formatFacilities(facilities = []) {
  if (!Array.isArray(facilities) || !facilities.length) {
    return "-";
  }

  return facilities.join(", ");
}

export default function ClassroomsPage() {
  const [search, setSearch] = useState("");
  const [building, setBuilding] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [facilities, setFacilities] = useState("");
  const [maintenance, setMaintenance] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const filters = useMemo(() => {
    const nextFilters = {
      page,
      pageSize,
    };

    if (search.trim()) {
      nextFilters.search = search.trim();
    }

    if (building.trim()) {
      nextFilters.building = building.trim();
    }

    const parsedMin = normalizeNumber(minCapacity);
    const parsedMax = normalizeNumber(maxCapacity);

    if (parsedMin) {
      nextFilters.minCapacity = parsedMin;
    }

    if (parsedMax) {
      nextFilters.maxCapacity = parsedMax;
    }

    if (facilities.trim()) {
      nextFilters.facilities = facilities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .join(",");
    }

    if (maintenance === "true") {
      nextFilters.isMaintenance = true;
    }

    if (maintenance === "false") {
      nextFilters.isMaintenance = false;
    }

    return nextFilters;
  }, [
    building,
    facilities,
    maintenance,
    maxCapacity,
    minCapacity,
    page,
    pageSize,
    search,
  ]);

  const { data, isLoading, error } = useAvailability(filters);

  const totalPages = Math.max(
    1,
    Math.ceil((data.total || 0) / (data.pageSize || pageSize)),
  );
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  function onFilterChange(setter) {
    return (event) => {
      setter(event.target.value);
      setPage(1);
    };
  }

  function clearFilters() {
    setSearch("");
    setBuilding("");
    setMinCapacity("");
    setMaxCapacity("");
    setFacilities("");
    setMaintenance("all");
    setPage(1);
    setPageSize(DEFAULT_PAGE_SIZE);
  }

  const rows = data.items.map((room) => ({
    id: room.id,
    roomCode: room.roomCode,
    building: room.building,
    capacity: room.capacity,
    facilities: formatFacilities(room.facilities),
    maintenance: room.isMaintenance ? "Yes" : "No",
    actions: (
      <Link to={`/classrooms/${room.id}/availability`}>
        <Button type="button">View Availability</Button>
      </Link>
    ),
  }));

  const columns = [
    { key: "roomCode", label: "Room", sortable: true },
    { key: "building", label: "Building", sortable: true },
    { key: "capacity", label: "Capacity", sortable: true },
    { key: "facilities", label: "Facilities", sortable: true },
    { key: "maintenance", label: "Maintenance", sortable: true },
    { key: "actions", label: "Actions" },
  ];

  return (
    <section className="page classrooms-page">
      <PageHeader
        title="Classrooms"
        description="Search rooms, filter constraints, and inspect availability quickly."
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Classrooms" },
        ]}
        meta={`Showing page ${page} of ${totalPages}`}
        actions={
          <Button type="button" variant="secondary" onClick={clearFilters}>
            Reset Filters
          </Button>
        }
      />

      <section className="page-panel" aria-label="Classroom filters">
        <h2 className="page-panel-title">Filter Rooms</h2>
        <div className="classrooms-filters data-filters">
          <label>
            Search
            <TextInput
              value={search}
              onChange={onFilterChange(setSearch)}
              placeholder="Room code or building"
              type="search"
            />
          </label>

          <label>
            Building
            <TextInput
              value={building}
              onChange={onFilterChange(setBuilding)}
              placeholder="Main Block"
              type="text"
            />
          </label>

          <label>
            Min Capacity
            <TextInput
              value={minCapacity}
              onChange={onFilterChange(setMinCapacity)}
              placeholder="30"
              type="number"
              min="1"
            />
          </label>

          <label>
            Max Capacity
            <TextInput
              value={maxCapacity}
              onChange={onFilterChange(setMaxCapacity)}
              placeholder="120"
              type="number"
              min="1"
            />
          </label>

          <label>
            Facilities
            <TextInput
              value={facilities}
              onChange={onFilterChange(setFacilities)}
              placeholder="Projector, AC"
              type="text"
            />
          </label>

          <label>
            Maintenance
            <select
              value={maintenance}
              onChange={onFilterChange(setMaintenance)}
            >
              <option value="all">All</option>
              <option value="false">Active Rooms</option>
              <option value="true">Maintenance Only</option>
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

          <div className="classrooms-filter-actions">
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

        {isLoading ? (
          <>
            <p className="status-info" role="status">
              Loading classrooms and applying filters...
            </p>
            <div className="classrooms-table-wrap data-table-wrap">
              <TableSkeleton rows={6} columns={6} label="Loading classrooms" />
            </div>
          </>
        ) : (
          <div className="classrooms-table-wrap data-table-wrap">
            <DataTable
              columns={columns}
              rows={rows}
              emptyMessage="No classrooms match your filters. Try adjusting building, capacity, or maintenance status."
            />
          </div>
        )}

        <div
          className="classrooms-pagination data-pagination"
          aria-label="Classroom pagination"
        >
          <p>
            Page {page} of {totalPages} | Total rooms: {data.total || 0} | Sort
            via table headers
          </p>
          <div className="classrooms-pagination-actions data-pagination-actions">
            <Button
              type="button"
              disabled={!canGoPrev || isLoading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>

            <Button
              type="button"
              disabled={!canGoNext || isLoading}
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
