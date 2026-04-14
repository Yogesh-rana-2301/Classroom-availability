import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchRoomAvailability } from "../features/availability/api/availabilityApi";
import AvailabilityGrid from "../features/availability/components/AvailabilityGrid";
import { createBooking } from "../features/bookings/api/bookingsApi";
import { validateBookingInput } from "../features/bookings/validators/bookingSchema";
import { BookingForm } from "../features/bookings";
import { useAuth } from "../app/AuthProvider";
import Button from "../shared/components/Button";
import { TimelineSkeleton } from "../shared/components/LoadingSkeleton";
import BaseModal from "../shared/modal/BaseModal";
import PageHeader from "../shared/components/PageHeader";
import { formatISODate } from "../utils/dateTime";

function getTodayDateValue() {
  return formatISODate(new Date().toISOString());
}

export default function RoomAvailabilityPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const [date, setDate] = useState(getTodayDateValue);
  const [data, setData] = useState({
    roomId: id,
    date: getTodayDateValue(),
    slots: [],
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  const canBook = user?.role === "ADMIN" || user?.role === "FACULTY";

  const bookingFormDefaults = useMemo(
    () => ({
      roomId: id || "",
      date,
      startTime: selectedSlot?.startTime || "",
      endTime: selectedSlot?.endTime || "",
    }),
    [date, id, selectedSlot],
  );

  const loadAvailability = useCallback(async () => {
    if (!id) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetchRoomAvailability(id, { date });
      setData({
        roomId: response?.roomId || id,
        date: response?.date || date,
        slots: Array.isArray(response?.slots) ? response.slots : [],
        message: response?.message || "",
      });
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          "Unable to fetch room availability. Please try again.",
      );
      setData((current) => ({ ...current, slots: [] }));
    } finally {
      setIsLoading(false);
    }
  }, [date, id]);

  useEffect(() => {
    let active = true;

    async function run() {
      if (!active) {
        return;
      }
      await loadAvailability();
    }

    run();

    return () => {
      active = false;
    };
  }, [loadAvailability]);

  useEffect(() => {
    setSelectedSlot(null);
    setIsBookingModalOpen(false);
    setBookingConfirmation(null);
  }, [date]);

  async function handleCreateBooking(form) {
    if (!canBook) {
      setBookingError("Only faculty and admins can create bookings.");
      return;
    }

    const payload = {
      roomId: id,
      date,
      startTime: form.startTime?.trim(),
      endTime: form.endTime?.trim(),
      purpose: form.purpose?.trim() || undefined,
    };

    const validation = validateBookingInput(payload);
    if (!validation.valid) {
      setBookingError(validation.message);
      return;
    }

    if (payload.startTime >= payload.endTime) {
      setBookingError("End time must be after start time.");
      return;
    }

    setIsSubmitting(true);
    setBookingError("");
    setBookingSuccess("");
    setBookingConfirmation(null);

    try {
      await createBooking(payload);
      setBookingSuccess("Booking created successfully.");
      setBookingConfirmation({
        roomId: id,
        date,
        startTime: payload.startTime,
        endTime: payload.endTime,
      });
      await loadAvailability();
    } catch (requestError) {
      setBookingError(
        requestError?.response?.data?.message ||
          "Failed to create booking. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function closeBookingModal() {
    if (isSubmitting) {
      return;
    }

    setIsBookingModalOpen(false);
  }

  function resetBookingFlow() {
    setBookingConfirmation(null);
    setBookingError("");
    setBookingSuccess("");
    setIsBookingModalOpen(false);
    setSelectedSlot(null);
  }

  const totalSlots = data.slots.length;

  return (
    <section className="page room-availability-page">
      <PageHeader
        title="Room Availability"
        description="Check timeline status and create a booking when a slot is free."
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Classrooms", to: "/classrooms" },
          { label: "Room Availability" },
        ]}
        meta={
          <>
            Room ID: <strong>{id}</strong>
          </>
        }
        actions={
          <Link to="/classrooms">
            <Button type="button" variant="secondary">
              Back to Rooms
            </Button>
          </Link>
        }
      />

      <section className="page-panel" aria-label="Availability controls">
        <div className="availability-toolbar">
          <label>
            Date
            <input
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setBookingSuccess("");
                setBookingError("");
              }}
            />
          </label>
        </div>

        <div className="availability-legend" aria-label="Availability legend">
          <span className="legend-pill legend-available">Available</span>
          <span className="legend-pill legend-booked">Booked</span>
          <span className="legend-pill legend-unavailable">Unavailable</span>
          <span className="legend-pill legend-maintenance">Maintenance</span>
        </div>
      </section>

      <section className="page-panel" aria-live="polite" aria-busy={isLoading}>
        <h2 className="page-panel-title">Timeline</h2>

        {isLoading ? (
          <>
            <p className="status-info" role="status">
              Loading room timeline for {date}...
            </p>
            <TimelineSkeleton rows={8} />
          </>
        ) : null}

        {error ? (
          <p className="status-error" role="alert">
            {error}
          </p>
        ) : null}

        {!isLoading && !error ? (
          <>
            <p>
              Date: {data.date || date} | Returned slots: {totalSlots}
            </p>

            {data.message ? <p>{data.message}</p> : null}

            {canBook ? (
              <p className="booking-touchpoint-note">
                Select an available row to open the booking sheet.
              </p>
            ) : (
              <p className="booking-touchpoint-note">
                Read-only access. Faculty/Admin accounts can open booking.
              </p>
            )}

            <AvailabilityGrid
              slots={data.slots}
              selectedSlot={selectedSlot}
              onSelectSlot={(slot) => {
                setSelectedSlot(slot);
                setBookingSuccess("");
                setBookingError("");
                setBookingConfirmation(null);

                if (canBook) {
                  setIsBookingModalOpen(true);
                }
              }}
            />
          </>
        ) : null}
      </section>

      {bookingSuccess ? (
        <section
          className="page-panel booking-confirmation-inline"
          role="status"
        >
          <h2 className="page-panel-title">Latest Booking Update</h2>
          <p className="status-success">{bookingSuccess}</p>
        </section>
      ) : null}

      {isBookingModalOpen ? (
        <BaseModal
          title="Create Booking"
          onClose={closeBookingModal}
          width="lg"
        >
          {bookingConfirmation ? (
            <section className="booking-confirmation-state" role="status">
              <p className="booking-confirmation-badge">Confirmed</p>
              <h3>Booking created successfully</h3>
              <p>
                Room <strong>{bookingConfirmation.roomId}</strong> on{" "}
                <strong>{bookingConfirmation.date}</strong> from{" "}
                <strong>
                  {bookingConfirmation.startTime} -{" "}
                  {bookingConfirmation.endTime}
                </strong>
                .
              </p>
              <div className="booking-confirmation-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetBookingFlow}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setBookingConfirmation(null);
                    setBookingError("");
                    setBookingSuccess("");
                  }}
                >
                  Book Another Slot
                </Button>
              </div>
            </section>
          ) : (
            <>
              <div className="booking-modal-summary">
                <p className="booking-modal-summary-title">Selected Slot</p>
                <p>
                  {selectedSlot?.startTime || "--:--"} -{" "}
                  {selectedSlot?.endTime || "--:--"} on {date}
                </p>
              </div>

              {bookingError ? (
                <p className="status-error" role="alert">
                  {bookingError}
                </p>
              ) : null}

              <BookingForm
                onSubmit={handleCreateBooking}
                initialValues={bookingFormDefaults}
                isLoading={isSubmitting}
                lockRoomAndDate
                hideLockedFields
                submitLabel="Confirm Booking"
              />
            </>
          )}
        </BaseModal>
      ) : null}
    </section>
  );
}
