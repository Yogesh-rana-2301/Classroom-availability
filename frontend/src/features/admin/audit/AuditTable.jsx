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
  return (
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>User</th>
          <th>Action</th>
          <th>Entity</th>
          <th>Entity ID</th>
          <th>Metadata</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{formatDate(row.createdAt)}</td>
            <td>{row.userId || "-"}</td>
            <td>{row.action}</td>
            <td>{row.entity}</td>
            <td>{row.entityId || "-"}</td>
            <td className="audit-metadata">{formatMetadata(row.metadata)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
