import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

export default function FilterModal({
  isOpen,
  onClose,
  onApply,
  onClear,
  search,
  setSearch,
  building,
  setBuilding,
  minCapacity,
  setMinCapacity,
  maxCapacity,
  setMaxCapacity,
  facilitySelections,
  handleFacilitiesChange,
  maintenance,
  setMaintenance,
  availabilityDate,
  setAvailabilityDate,
  slotStart,
  setSlotStart,
  slotEnd,
  setSlotEnd,
  filterOptions,
  timeOptions,
  endTimeOptions,
}) {
  if (!isOpen) {
    return null;
  }

  function onFilterChange(setter) {
    return (event) => {
      setter(event.target.value);
    };
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Filter Classrooms</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          <TextField
            label="Search"
            value={search}
            onChange={onFilterChange(setSearch)}
            placeholder="Room code or building"
            type="search"
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="building-select-label">Building</InputLabel>
            <Select
              labelId="building-select-label"
              value={building}
              label="Building"
              onChange={onFilterChange(setBuilding)}
            >
              <MenuItem value="">All Buildings</MenuItem>
              {filterOptions.buildings.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Min Capacity"
            value={minCapacity}
            onChange={onFilterChange(setMinCapacity)}
            placeholder="30"
            type="number"
            min="1"
            fullWidth
          />

          <TextField
            label="Max Capacity"
            value={maxCapacity}
            onChange={onFilterChange(setMaxCapacity)}
            placeholder="120"
            type="number"
            min="1"
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="facilities-select-label">Facilities</InputLabel>
            <Select
              labelId="facilities-select-label"
              multiple
              value={facilitySelections}
              onChange={handleFacilitiesChange}
              label="Facilities"
            >
              {filterOptions.facilities.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={maintenance === "true"}
                onChange={(e) => setMaintenance(e.target.checked ? "true" : "")}
              />
            }
            label="Show rooms under maintenance"
          />

          <TextField
            label=""
            type="date"
            value={availabilityDate}
            onChange={onFilterChange(setAvailabilityDate)}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="start-time-select-label">Start Time</InputLabel>
            <Select
              labelId="start-time-select-label"
              value={slotStart}
              label="Start Time"
              onChange={onFilterChange(setSlotStart)}
            >
              {timeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="end-time-select-label">End Time</InputLabel>
            <Select
              labelId="end-time-select-label"
              value={slotEnd}
              label="End Time"
              onChange={onFilterChange(setSlotEnd)}
            >
              {endTimeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClear}>Clear</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onApply} variant="contained">
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
}
