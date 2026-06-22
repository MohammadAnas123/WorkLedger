import { request } from "./client";

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function rangeToParams(range = "all") {
  const today = new Date();
  if (range === "month") {
    return {
      from: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`,
      to: formatDate(today),
    };
  }

  if (range === "lastMonth") {
    const firstOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    return {
      from: formatDate(firstOfLastMonth),
      to: formatDate(lastOfLastMonth),
    };
  }

  if (range === "year") {
    return {
      from: `${today.getFullYear()}-01-01`,
      to: formatDate(today),
    };
  }

  return {};
}

function buildParams(opts = {}) {
  if (opts.from || opts.to) {
    return { from: opts.from, to: opts.to };
  }
  return rangeToParams(opts.range);
}

/** GET /api/reports/summary?from=&to= */
export async function getSummary(opts = {}) {
  return request("/reports/summary", { params: buildParams(opts) });
}

/** GET /api/reports/by-client?from=&to= */
export async function getByClient(opts = {}) {
  return request("/reports/by-client", { params: buildParams(opts) });
}

/** GET /api/reports/by-worktype?from=&to= */
export async function getByWorkType(opts = {}) {
  return request("/reports/by-worktype", { params: buildParams(opts) });
}
