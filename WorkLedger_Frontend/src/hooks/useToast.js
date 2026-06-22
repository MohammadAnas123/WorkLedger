import { useRef, useState } from "react";

/**
 * Simple toast hook: call showToast("message") from anywhere that has
 * access to it, and render the returned `toast` value somewhere fixed
 * (App.jsx renders it at the root). Auto-dismisses after ~2.2s.
 */
export function useToast() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setToast(null), 2200);
  };

  return { toast, showToast };
}
