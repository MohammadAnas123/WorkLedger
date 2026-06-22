export const todayISO = () => new Date().toISOString().slice(0, 10);

/**
 * Returns true if the given ISO date string falls within the named range,
 * relative to "now". Mirrors the date-range logic used by the Reports page.
 * range: "month" | "lastMonth" | "year" | "all"
 */
export function isInRange(dateStr, range) {
  const now = new Date();
  const d = new Date(dateStr);

  if (range === "month") {
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }
  if (range === "lastMonth") {
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getFullYear() === lm.getFullYear() && d.getMonth() === lm.getMonth();
  }
  if (range === "year") {
    return d.getFullYear() === now.getFullYear();
  }
  return true; // "all"
}
