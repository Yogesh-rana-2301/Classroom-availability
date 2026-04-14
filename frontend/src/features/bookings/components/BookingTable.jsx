import Button from "../../../shared/components/Button";
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
  items = [],
  onCancel,
  cancellingBookingId,
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

  const rows = items.map((item) => ({
    id: item.id,
    room: item.classroom?.roomCode || item.roomId,
    date: formatDate(item.date),
    sortDate: item.date || "",
    slot: `${item.startTime} - ${item.endTime}`,
    purpose: item.purpose || "-",
    status: <span className="status-pill">{item.status}</span>,
    actions:
      item.status === "CONFIRMED" && typeof onCancel === "function" ? (
        <Button
          onClick={() => onCancel(item)}
          disabled={cancellingBookingId === item.id}
          type="button"
          variant="secondary"
        >
          {cancellingBookingId === item.id ? "Cancelling..." : "Cancel"}
        </Button>
      ) : (
        <span>-</span>
      ),
  }));

  return (
    <DataTable
      columns={columns}
      rows={rows}
      emptyMessage="No bookings match your current filters."
    />
  );
}
