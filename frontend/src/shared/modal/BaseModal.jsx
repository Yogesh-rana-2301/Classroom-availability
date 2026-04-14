import { useEffect, useRef } from "react";

export default function BaseModal({ title, children, onClose, width = "md" }) {
  const dialogRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (!dialogRef.current) {
      return undefined;
    }

    previouslyFocusedRef.current = document.activeElement;

    const focusable = dialogRef.current.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    if (focusable.length) {
      focusable[0].focus();
    } else {
      dialogRef.current.focus();
    }

    function handleKeyDown(event) {
      if (!dialogRef.current) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const items = dialogRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!items.length) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocusedRef.current?.focus) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [onClose]);

  return (
    <div className="base-modal-overlay" role="presentation">
      <div
        className="base-modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
      <section
        ref={dialogRef}
        className={`base-modal base-modal-${width}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <header className="base-modal-header">
          <h3>{title}</h3>
          <button
            type="button"
            className="ca-button ca-button-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </header>
        <div className="base-modal-content">{children}</div>
      </section>
    </div>
  );
}
