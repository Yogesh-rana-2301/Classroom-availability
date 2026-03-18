export default function BookingTable({ items = [] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Room</th>
          <th>Date</th>
          <th>Slot</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.classroom?.roomCode || item.roomId}</td>
            <td>{item.date}</td>
            <td>
              {item.startTime} - {item.endTime}
            </td>
            <td>{item.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
