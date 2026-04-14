import { toSlotLabel } from "../utils/slotUtils";

const TIMELINE_START_HOUR = 8;
const TIMELINE_END_HOUR = 21;

function toMinutes(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const parts = value.split(":");
  if (parts.length < 2) {
    return null;
  }

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
}

function formatHour(value) {
  return String(value).padStart(2, "0") + ":00";
}

function normalizeSlot(slot) {
  if (!slot || typeof slot !== "object") {
    return null;
  }

  const startTime = slot.startTime || slot.start || slot.from;
  const endTime = slot.endTime || slot.end || slot.to;

  const status = String(slot.status || slot.type || "AVAILABLE").toUpperCase();
  const details =
    slot.purpose || slot.reason || slot.subject || slot.note || "";

  return {
    startTime,
    endTime,
    startMinutes: toMinutes(startTime),
    endMinutes: toMinutes(endTime),
    status,
    details,
  };
}

function normalizeStatus(status) {
  if (status.includes("MAINTENANCE")) {
    return "maintenance";
  }

  if (
    status.includes("BOOKED") ||
    status.includes("OCCUPIED") ||
    status.includes("RESERVED") ||
    status.includes("CONFIRMED")
  ) {
    return "booked";
  }

  if (status.includes("BLOCKED") || status.includes("UNAVAILABLE")) {
    return "unavailable";
  }

  return "available";
}

function toStatusLabel(statusType) {
  if (statusType === "maintenance") {
    return "Maintenance";
  }

  if (statusType === "booked") {
    return "Booked";
  }

  if (statusType === "unavailable") {
    return "Unavailable";
  }

  return "Available";
}

function buildTimeline() {
  const items = [];

  for (let hour = TIMELINE_START_HOUR; hour < TIMELINE_END_HOUR; hour += 1) {
    const startTime = formatHour(hour);
    const endTime = formatHour(hour + 1);
    items.push({
      startTime,
      endTime,
      startMinutes: hour * 60,
      endMinutes: (hour + 1) * 60,
    });
  }

  return items;
}

function pickSlotForBlock(block, normalizedSlots) {
  const matches = normalizedSlots.filter((slot) => {
    if (!slot || slot.startMinutes === null || slot.endMinutes === null) {
      return false;
    }

    return (
      block.startMinutes < slot.endMinutes &&
      block.endMinutes > slot.startMinutes
    );
  });

  if (!matches.length) {
    return null;
  }

  const priority = {
    maintenance: 3,
    unavailable: 2,
    booked: 1,
    available: 0,
  };

  return matches.sort((left, right) => {
    const a = normalizeStatus(left.status);
    const b = normalizeStatus(right.status);
    return (priority[b] || 0) - (priority[a] || 0);
  })[0];
}

export default function AvailabilityGrid({
  slots = [],
  onSelectSlot,
  selectedSlot,
}) {
  const timeline = buildTimeline();
  const normalizedSlots = slots.map(normalizeSlot).filter(Boolean);

  return (
    <div
      className="availability-grid"
      role="table"
      aria-label="Room availability timeline"
    >
      <div className="availability-grid-header" role="row">
        <span role="columnheader">Time Slot</span>
        <span role="columnheader">Status</span>
        <span role="columnheader">Details</span>
      </div>

      {timeline.map((block) => {
        const matchedSlot = pickSlotForBlock(block, normalizedSlots);
        const statusType = matchedSlot
          ? normalizeStatus(matchedSlot.status)
          : "available";
        const isSelectable =
          statusType === "available" && typeof onSelectSlot === "function";
        const isSelected =
          selectedSlot?.startTime === block.startTime &&
          selectedSlot?.endTime === block.endTime;
        const statusLabel = toStatusLabel(statusType);
        const details = matchedSlot
          ? matchedSlot.details ||
            toSlotLabel(matchedSlot.startTime, matchedSlot.endTime)
          : "Open slot. Select to prefill booking.";

        return (
          <div
            className={`availability-grid-row availability-${statusType}${isSelectable ? " availability-grid-selectable" : ""}${isSelected ? " availability-grid-selected" : ""}`}
            key={block.startTime}
            role="row"
            onClick={
              isSelectable
                ? () =>
                    onSelectSlot({
                      startTime: block.startTime,
                      endTime: block.endTime,
                    })
                : undefined
            }
            onKeyDown={
              isSelectable
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectSlot({
                        startTime: block.startTime,
                        endTime: block.endTime,
                      });
                    }
                  }
                : undefined
            }
            tabIndex={isSelectable ? 0 : -1}
            aria-label={`${toSlotLabel(block.startTime, block.endTime)} ${statusLabel}${isSelectable ? ", selectable" : ""}`}
          >
            <span role="cell" className="availability-grid-slot-time">
              {toSlotLabel(block.startTime, block.endTime)}
            </span>
            <span role="cell">
              <span
                className={`availability-status availability-status-${statusType}`}
              >
                {statusLabel}
              </span>
            </span>
            <span role="cell" className="availability-grid-details">
              {details}
              {isSelectable ? (
                <span className="availability-grid-action-hint">
                  Select slot
                </span>
              ) : null}
            </span>
          </div>
        );
      })}
    </div>
  );
}
