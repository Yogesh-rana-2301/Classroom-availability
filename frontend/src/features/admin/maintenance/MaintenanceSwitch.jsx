export default function MaintenanceSwitch({
  value,
  onChange,
  disabled = false,
  isLoading = false,
}) {
  return (
    <label className="maintenance-switch">
      Maintenance
      <input
        type="checkbox"
        checked={Boolean(value)}
        disabled={disabled || isLoading}
        onChange={(event) => onChange(event.target.checked)}
      />
      {isLoading ? <span>Saving...</span> : null}
    </label>
  );
}
