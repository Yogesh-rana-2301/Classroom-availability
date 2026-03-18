export default function MaintenanceSwitch({ value, onChange }) {
  return (
    <label>
      Maintenance
      <input
        type="checkbox"
        checked={Boolean(value)}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}
