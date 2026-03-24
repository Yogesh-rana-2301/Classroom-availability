export default function FormErrorSummary({
  errors = {},
  title = "Please fix the following:",
}) {
  const messages = Object.values(errors || {}).filter(Boolean);

  if (!messages.length) {
    return null;
  }

  return (
    <div className="form-error-summary" role="alert">
      <p>{title}</p>
      <ul>
        {messages.map((message, index) => (
          <li key={`${message}-${index}`}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
