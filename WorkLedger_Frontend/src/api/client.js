/**
 * Thin fetch wrapper shared by every api/*.js module.
 *
 * The frontend now talks directly to the Spring Boot backend.
 * Make sure VITE_API_BASE_URL in .env points at your running backend
 * (default: http://localhost:8080/api).
 */
export const USE_MOCK = false;

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

/**
 * Performs a fetch against the backend and returns parsed JSON.
 * Throws ApiError with the server's error envelope (see backend spec §8)
 * attached as `.body` when the response is not ok.
 */
export async function request(path, { method = "GET", body, params } = {}) {
  let url = `${BASE_URL}${path}`;

  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    );
    if (query.toString()) url += `?${query.toString()}`;
  }

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status, data);
  }

  return data;
}

export { ApiError };
