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
  return (
    <table>
      <thead>
        <tr>
          <th>Room</th>
          <th>Date</th>
          <th>Slot</th>
          <th>Purpose</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.classroom?.roomCode || item.roomId}</td>
            <td>{formatDate(item.date)}</td>
            <td>
              {item.startTime} - {item.endTime}
            </td>
            <td>{item.purpose || "-"}</td>
            <td>{item.status}</td>
            <td>
              {item.status === "CONFIRMED" && typeof onCancel === "function" ? (
                <button
                  onClick={() => onCancel(item)}
                  disabled={cancellingBookingId === item.id}
                  type="button"
                >
                  {cancellingBookingId === item.id ? "Cancelling..." : "Cancel"}
                </button>
              ) : (
                <span>-</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
