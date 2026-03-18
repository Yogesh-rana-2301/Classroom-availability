export default function AvailabilityGrid({ rooms = [] }) {
  return (
    <div>
      <h2>Availability Grid</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>{room.roomCode}</li>
        ))}
      </ul>
    </div>
  );
}
