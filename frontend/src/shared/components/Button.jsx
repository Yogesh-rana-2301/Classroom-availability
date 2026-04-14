export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const normalizedVariant = variant === "secondary" ? "secondary" : "primary";
  const classes = ["ca-button", `ca-button-${normalizedVariant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
