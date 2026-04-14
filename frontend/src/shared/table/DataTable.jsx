import { useMemo, useState } from "react";

function resolveSortValue(column, row) {
  if (typeof column.sortAccessor === "function") {
    return column.sortAccessor(row);
  }

  const value = row[column.key];
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return value.toLowerCase();
  }

  return "";
}

export default function DataTable({
  columns = [],
  rows = [],
  className = "",
  emptyMessage = "No records to display.",
}) {
  const classes = ["ca-data-table", className].filter(Boolean).join(" ");
  const defaultSortColumn = columns.find((column) => column.sortable);
  const [sortConfig, setSortConfig] = useState(
    defaultSortColumn
      ? { key: defaultSortColumn.key, direction: "asc" }
      : { key: null, direction: "asc" },
  );

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) {
      return rows;
    }

    const column = columns.find((item) => item.key === sortConfig.key);
    if (!column || !column.sortable) {
      return rows;
    }

    return [...rows].sort((left, right) => {
      const leftValue = resolveSortValue(column, left);
      const rightValue = resolveSortValue(column, right);

      if (leftValue < rightValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }

      if (leftValue > rightValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }

      return 0;
    });
  }, [columns, rows, sortConfig]);

  function handleSort(column) {
    if (!column.sortable) {
      return;
    }

    setSortConfig((current) => {
      if (current.key !== column.key) {
        return { key: column.key, direction: "asc" };
      }

      return {
        key: column.key,
        direction: current.direction === "asc" ? "desc" : "asc",
      };
    });
  }

  return (
    <table className={classes}>
      <thead>
        <tr>
          {columns.map((column) => {
            const isSorted = sortConfig.key === column.key;
            const ariaSort = column.sortable
              ? isSorted
                ? sortConfig.direction === "asc"
                  ? "ascending"
                  : "descending"
                : "none"
              : undefined;

            return (
              <th key={column.key} aria-sort={ariaSort}>
                {column.sortable ? (
                  <button
                    type="button"
                    className="data-table-sort"
                    onClick={() => handleSort(column)}
                  >
                    {column.label}
                    <span className="data-table-sort-icon" aria-hidden="true">
                      {isSorted
                        ? sortConfig.direction === "asc"
                          ? "↑"
                          : "↓"
                        : "↕"}
                    </span>
                  </button>
                ) : (
                  <span>{column.label}</span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((row, index) => (
          <tr key={row.id || index}>
            {columns.map((column) => (
              <td key={column.key}>{row[column.key]}</td>
            ))}
          </tr>
        ))}
        {!sortedRows.length ? (
          <tr>
            <td colSpan={columns.length}>
              <div className="empty-state">
                <p className="empty-state-title">No results found</p>
                <p className="empty-state-description">{emptyMessage}</p>
              </div>
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
}
