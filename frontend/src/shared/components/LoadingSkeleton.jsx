function SkeletonBlock({ className = "" }) {
  return (
    <span className={`skeleton-block ${className}`.trim()} aria-hidden="true" />
  );
}

export function TextSkeleton({ lines = 3, label = "Loading content" }) {
  return (
    <div
      className="skeleton-text"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBlock
          key={`text-line-${index}`}
          className={`skeleton-text-line${index === lines - 1 ? " skeleton-text-line-short" : ""}`}
        />
      ))}
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
  label = "Loading table data",
}) {
  return (
    <div
      className="skeleton-table"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className="skeleton-table-row skeleton-table-header"
        aria-hidden="true"
      >
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonBlock
            key={`header-cell-${index}`}
            className="skeleton-table-cell"
          />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          className="skeleton-table-row"
          key={`row-${rowIndex}`}
          aria-hidden="true"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonBlock
              key={`cell-${rowIndex}-${colIndex}`}
              className="skeleton-table-cell"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function TimelineSkeleton({
  rows = 6,
  label = "Loading availability timeline",
}) {
  return (
    <div
      className="skeleton-timeline"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={`timeline-row-${index}`}
          className="skeleton-timeline-row"
          aria-hidden="true"
        >
          <SkeletonBlock className="skeleton-timeline-time" />
          <SkeletonBlock className="skeleton-timeline-status" />
          <SkeletonBlock className="skeleton-timeline-details" />
        </div>
      ))}
    </div>
  );
}
