export default function CancelBookingDialog({ bookingId, onConfirm }) {
  if (!bookingId) {
    return null;
  }

  return (
    <div role="dialog" aria-modal="true">
      <p>Cancel booking {bookingId}?</p>
      <button onClick={() => onConfirm(bookingId)}>Confirm Cancel</button>
    </div>
  );
}
