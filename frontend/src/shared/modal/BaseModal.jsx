export default function BaseModal({ title, children, onClose }) {
  return (
    <div role="dialog" aria-modal="true">
      <h3>{title}</h3>
      <div>{children}</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
