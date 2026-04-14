import DataTable from "../../../shared/table/DataTable";

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function formatMetadata(value) {
  if (!value) {
    return "-";
  }

  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch (_error) {
    return "[metadata]";
  }
}

export default function AuditTable({ rows = [] }) {
  const columns = [
    {
      key: "time",
      label: "Time",
      sortable: true,
      sortAccessor: (row) => row.sortCreatedAt,
    },
    { key: "user", label: "User", sortable: true },
    { key: "action", label: "Action", sortable: true },
    { key: "entity", label: "Entity", sortable: true },
    { key: "entityId", label: "Entity ID", sortable: true },
    { key: "metadata", label: "Metadata" },
  ];

  const tableRows = rows.map((row) => ({
    id: row.id,
    time: formatDate(row.createdAt),
    sortCreatedAt: row.createdAt || "",
    user: row.userId || "-",
    action: row.action,
    entity: row.entity,
    entityId: row.entityId || "-",
    metadata: (
      <span className="audit-metadata">{formatMetadata(row.metadata)}</span>
    ),
  }));

  return (
    <DataTable
      columns={columns}
      rows={tableRows}
      emptyMessage="No audit events found for these filters."
    />
  );
}
