import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Link as MuiLink,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { fetchClassroomFilterOptions } from "../features/availability/api/availabilityApi";
import FilterModal from "../features/availability/components/FilterModal";
import ClassroomCard from "../features/availability/components/ClassroomCard";
import { useAvailability } from "../features/availability/hooks/useAvailability";
import DataTable from "../shared/table/DataTable";

const DEFAULT_PAGE_SIZE = 10;
const TIME_START_HOUR = 8;
const TIME_END_HOUR = 21;
const TIME_STEP_MINUTES = 30;

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

function timeToMinutes(value) {
  const [hour, minute] = String(value || "")
    .split(":")
    .map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null;
  }
  return hour * 60 + minute;
}

function buildTimeOptions() {
  const options = [];
  const startMinutes = TIME_START_HOUR * 60;
  const endMinutes = TIME_END_HOUR * 60;

  for (
    let minutes = startMinutes;
    minutes <= endMinutes;
    minutes += TIME_STEP_MINUTES
  ) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0",
    )}`;
    options.push({ value, label: value, minutes });
  }

  return options;
}

function buildFiltersFromValues(values) {
  const nextFilters = {
    page: values.page,
    pageSize: values.pageSize,
  };
  let nextAvailabilityError = "";

  if (values.search.trim()) {
    nextFilters.search = values.search.trim();
  }

  if (values.building.trim()) {
    nextFilters.building = values.building.trim();
  }

  const parsedMin = normalizeNumber(values.minCapacity);
  const parsedMax = normalizeNumber(values.maxCapacity);

  if (parsedMin) {
    nextFilters.minCapacity = parsedMin;
  }

  if (parsedMax) {
    nextFilters.maxCapacity = parsedMax;
  }

  if (values.facilitySelections.length) {
    nextFilters.facilities = values.facilitySelections.join(",");
  }

  if (values.maintenance === "true") {
    nextFilters.isMaintenance = true;
  }

  if (values.maintenance === "false") {
    nextFilters.isMaintenance = false;
  }

  if (values.availabilityDate || values.slotStart || values.slotEnd) {
    if (!values.availabilityDate || !values.slotStart || !values.slotEnd) {
      nextAvailabilityError =
        "Select a date, start time, and end time to filter by availability.";
    } else if (values.slotStart >= values.slotEnd) {
      nextAvailabilityError = "End time must be after start time.";
    } else {
      nextFilters.date = values.availabilityDate;
      nextFilters.startTime = values.slotStart;
      nextFilters.endTime = values.slotEnd;
    }
  }

  return { filters: nextFilters, availabilityError: nextAvailabilityError };
}

function parseSearchParams(searchParams) {
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || DEFAULT_PAGE_SIZE);
  const facilities = searchParams.get("facilities") || "";
  const isMaintenance = searchParams.get("isMaintenance");

  return {
    search: searchParams.get("search") || "",
    building: searchParams.get("building") || "",
    minCapacity: searchParams.get("minCapacity") || "",
    maxCapacity: searchParams.get("maxCapacity") || "",
    facilitySelections: facilities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    maintenance:
      isMaintenance === "true" || isMaintenance === "false"
        ? isMaintenance
        : "all",
    availabilityDate: searchParams.get("date") || "",
    slotStart: searchParams.get("startTime") || "",
    slotEnd: searchParams.get("endTime") || "",
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize:
      Number.isFinite(pageSize) && pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE,
  };
}

function buildSearchParams(filters) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.building) {
    params.set("building", filters.building);
  }

  if (filters.minCapacity) {
    params.set("minCapacity", String(filters.minCapacity));
  }

  if (filters.maxCapacity) {
    params.set("maxCapacity", String(filters.maxCapacity));
  }

  if (filters.facilities) {
    params.set("facilities", filters.facilities);
  }

  if (typeof filters.isMaintenance === "boolean") {
    params.set("isMaintenance", String(filters.isMaintenance));
  }

  if (filters.date) {
    params.set("date", filters.date);
  }

  if (filters.startTime) {
    params.set("startTime", filters.startTime);
  }

  if (filters.endTime) {
    params.set("endTime", filters.endTime);
  }

  if (filters.page && filters.page !== 1) {
    params.set("page", String(filters.page));
  }

  if (filters.pageSize && filters.pageSize !== DEFAULT_PAGE_SIZE) {
    params.set("pageSize", String(filters.pageSize));
  }

  return params;
}

export default function ClassroomsPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [building, setBuilding] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [facilitySelections, setFacilitySelections] = useState([]);
  const [maintenance, setMaintenance] = useState("all");
  const [availabilityDate, setAvailabilityDate] = useState("");
  const [slotStart, setSlotStart] = useState("");
  const [slotEnd, setSlotEnd] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [appliedFilters, setAppliedFilters] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [filterOptions, setFilterOptions] = useState({
    buildings: [],
    facilities: [],
  });
  const [filterOptionsError, setFilterOptionsError] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const timeOptions = useMemo(() => buildTimeOptions(), []);
  const endTimeOptions = useMemo(() => {
    if (!slotStart) {
      return timeOptions;
    }

    const startMinutes = timeToMinutes(slotStart);
    if (startMinutes === null) {
      return timeOptions;
    }

    return timeOptions.filter((option) => option.minutes > startMinutes);
  }, [slotStart, timeOptions]);

  const parsedParams = useMemo(
    () => parseSearchParams(searchParams),
    [searchParams],
  );

  useEffect(() => {
    const { filters: nextApplied } = buildFiltersFromValues(parsedParams);

    setSearch(parsedParams.search);
    setBuilding(parsedParams.building);
    setMinCapacity(parsedParams.minCapacity);
    setMaxCapacity(parsedParams.maxCapacity);
    setFacilitySelections(parsedParams.facilitySelections);
    setMaintenance(parsedParams.maintenance);
    setAvailabilityDate(parsedParams.availabilityDate);
    setSlotStart(parsedParams.slotStart);
    setSlotEnd(parsedParams.slotEnd);
    setPage(parsedParams.page);
    setPageSize(parsedParams.pageSize);
    setAppliedFilters(nextApplied);
  }, [parsedParams]);

  useEffect(() => {
    let active = true;

    async function loadFilterOptions() {
      setFilterOptionsError("");

      try {
        const response = await fetchClassroomFilterOptions();
        if (active) {
          setFilterOptions({
            buildings: response?.buildings || [],
            facilities: response?.facilities || [],
          });
        }
      } catch (requestError) {
        if (active) {
          setFilterOptionsError(
            requestError?.response?.data?.message ||
              "Unable to load filter options.",
          );
        }
      }
    }

    loadFilterOptions();

    return () => {
      active = false;
    };
  }, []);

  const { filters, availabilityError } = useMemo(
    () =>
      buildFiltersFromValues({
        search,
        building,
        minCapacity,
        maxCapacity,
        facilitySelections,
        maintenance,
        availabilityDate,
        slotStart,
        slotEnd,
        page,
        pageSize,
      }),
    [
      building,
      facilitySelections,
      maintenance,
      maxCapacity,
      minCapacity,
      page,
      pageSize,
      search,
      availabilityDate,
      slotStart,
      slotEnd,
    ],
  );

  const { data, isLoading, error } = useAvailability(appliedFilters);

  const totalPages = Math.max(
    1,
    Math.ceil((data?.total || 0) / (data?.pageSize || pageSize)),
  );
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  function handleClearFilters() {
    setSearch("");
    setBuilding("");
    setMinCapacity("");
    setMaxCapacity("");
    setFacilitySelections([]);
    setMaintenance("all");
    setAvailabilityDate("");
    setSlotStart("");
    setSlotEnd("");
    setPage(1);
    setPageSize(DEFAULT_PAGE_SIZE);
    setAppliedFilters({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
    setSearchParams({});
    setIsFilterModalOpen(false);
  }

  function handleApplyFilters() {
    if (availabilityError) {
      return;
    }
    const nextPage = 1;
    const nextFilters = { ...filters, page: nextPage };
    setPage(nextPage);
    setAppliedFilters(nextFilters);
    setSearchParams(buildSearchParams(nextFilters));
    setIsFilterModalOpen(false);
  }

  function handleFacilitiesChange(event) {
    const {
      target: { value },
    } = event;
    setFacilitySelections(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value,
    );
  }

  function updatePage(nextPage) {
    const nextFilters = { ...appliedFilters, page: nextPage };
    setPage(nextPage);
    setAppliedFilters(nextFilters);
    setSearchParams(buildSearchParams(nextFilters));
  }

  useEffect(() => {
    if (!slotStart || !slotEnd) {
      return;
    }

    if (slotStart >= slotEnd) {
      setSlotEnd("");
    }
  }, [slotEnd, slotStart]);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const rows = data?.items.map((room) => ({
    id: room.id,
    roomCode: room.roomCode,
    building: room.building,
    capacity: room.capacity,
    facilities: formatFacilities(room.facilities),
    maintenance: room.isMaintenance ? "Yes" : "No",
    actions: (
      <Link
        to={`/classrooms/${room.id}/availability`}
        state={{ returnTo: location.search }}
      >
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
    <Container maxWidth="lg">
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <MuiLink component={Link} underline="hover" color="inherit" to="/">
          Dashboard
        </MuiLink>
        <Typography color="text.primary">Rooms</Typography>
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
            Classrooms
          </Typography>
          <Typography>Browse and filter all learning spaces.</Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            onClick={() => setIsFilterModalOpen(true)}
          >
            Filter
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button variant="outlined" onClick={() => handleInstantCheck("now")}>
          Available Now
        </Button>
        <Button variant="outlined" onClick={() => handleInstantCheck("next")}>
          Available Next Hour
        </Button>
      </Box>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        search={search}
        setSearch={setSearch}
        building={building}
        setBuilding={setBuilding}
        minCapacity={minCapacity}
        setMinCapacity={setMinCapacity}
        maxCapacity={maxCapacity}
        setMaxCapacity={setMaxCapacity}
        facilitySelections={facilitySelections}
        handleFacilitiesChange={handleFacilitiesChange}
        maintenance={maintenance}
        setMaintenance={setMaintenance}
        availabilityDate={availabilityDate}
        setAvailabilityDate={setAvailabilityDate}
        slotStart={slotStart}
        setSlotStart={setSlotStart}
        slotEnd={slotEnd}
        setSlotEnd={setSlotEnd}
        filterOptions={filterOptions}
        timeOptions={timeOptions}
        endTimeOptions={endTimeOptions}
        availabilityError={availabilityError}
        filterOptionsError={filterOptionsError}
      />

      {isLoading ? (
        <Skeleton variant="rectangular" width="100%" height={400} />
      ) : isMobile ? (
        <Box>
          {rows.map((row) => (
            <ClassroomCard key={row.id} room={row} returnTo={location.search} />
          ))}
        </Box>
      ) : (
        <DataTable columns={columns} rows={rows || []} />
      )}
    </Container>
  );
}
