export default function RoomCard({ room }) {
  if (!room) {
    return null;
  }

  return (
    <article>
      <h3>{room.roomCode}</h3>
      <p>{room.building}</p>
      <p>Capacity: {room.capacity}</p>
    </article>
  );
}
