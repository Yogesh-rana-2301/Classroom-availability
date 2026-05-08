import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
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
  emptyMessage = "No records to display.",
}) {
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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.key}
                sortDirection={
                  sortConfig.key === column.key ? sortConfig.direction : false
                }
              >
                {column.sortable ? (
                  <TableSortLabel
                    active={sortConfig.key === column.key}
                    direction={
                      sortConfig.key === column.key
                        ? sortConfig.direction
                        : "asc"
                    }
                    onClick={() => handleSort(column)}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
          {sortedRows.map((row, rowIndex) => (
            <TableRow key={row.id || rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? column.render(row) : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
