const AUTH_SESSION_EVENT = "auth:session-updated";

export function emitAuthSessionUpdated(payload) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(AUTH_SESSION_EVENT, { detail: payload }),
  );
}

export function onAuthSessionUpdated(handler) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const listener = (event) => {
    handler(event.detail);
  };

  window.addEventListener(AUTH_SESSION_EVENT, listener);

  return () => {
    window.removeEventListener(AUTH_SESSION_EVENT, listener);
  };
}
