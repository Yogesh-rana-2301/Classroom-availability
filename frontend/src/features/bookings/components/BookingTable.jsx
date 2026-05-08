import { Button, Chip, TablePagination } from "@mui/material";
import DataTable from "../../../shared/table/DataTable";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString();
}

export default function BookingTable({
  bookings = [],
  onCancel,
  cancellingId,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}) {
  const columns = [
    { key: "room", label: "Room", sortable: true },
    {
      key: "date",
      label: "Date",
      sortable: true,
      sortAccessor: (row) => row.sortDate,
    },
    { key: "slot", label: "Slot", sortable: true },
    { key: "purpose", label: "Purpose", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "actions", label: "Actions" },
  ];

  const rows = bookings.map((item) => ({
    id: item.id,
    room: item.classroom?.roomCode || item.classroomId,
    date: formatDate(item.date),
    sortDate: item.date || "",
    slot: `${item.startTime} - ${item.endTime}`,
    purpose: item.purpose || "-",
    status: (
      <Chip
        label={item.status}
        color={
          item.status === "CONFIRMED"
            ? "success"
            : item.status === "CANCELLED"
              ? "error"
              : "default"
        }
      />
    ),
    actions:
      item.status === "CONFIRMED" && typeof onCancel === "function" ? (
        <Button
          onClick={() => onCancel(item)}
          disabled={cancellingId === item.id}
          variant="outlined"
          size="small"
        >
          {cancellingId === item.id ? "Cancelling..." : "Cancel"}
        </Button>
      ) : (
        <span>-</span>
      ),
  }));

  return (
    <>
      <DataTable
        columns={columns}
        rows={rows}
        emptyMessage="No bookings match your current filters."
      />
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        rowsPerPage={pageSize}
        onPageChange={(e, newPage) => onPageChange(newPage + 1)}
        onRowsPerPageChange={(e) => {
          onPageSizeChange(parseInt(e.target.value, 10));
          onPageChange(1);
        }}
      />
    </>
  );
}
