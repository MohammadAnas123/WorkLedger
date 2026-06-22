import { request } from "./client";

/**
 * Dashboard-only aggregate: revenue, profit, and count of distinct clients
 * with at least one material or labour entry dated in the current month.
 */
export async function getDashboardMonthStats() {
  return request("/dashboard/summary");
}
