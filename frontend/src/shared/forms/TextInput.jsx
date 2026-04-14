export default function TextInput({ className = "", ...props }) {
  const classes = ["ca-input", className].filter(Boolean).join(" ");
  return <input className={classes} {...props} />;
}
