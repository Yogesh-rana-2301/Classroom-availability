export default function AuditTable({ rows = [] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>User</th>
          <th>Action</th>
          <th>Entity</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{row.createdAt}</td>
            <td>{row.userId}</td>
            <td>{row.action}</td>
            <td>{row.entity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
