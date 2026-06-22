import { request } from "./client";

/**
 * GET /api/clients
 * Optional: { status, search }
 */
export async function listClients({ status, search } = {}) {
  return request("/clients", { params: { status, search } });
}

/** GET /api/clients/{id} */
export async function getClient(id) {
  return request(`/clients/${id}`);
}

/** POST /api/clients — see backend spec §5.1 for required fields */
export async function createClient(payload) {
  return request("/clients", { method: "POST", body: payload });
}

/**
 * PATCH /api/clients/{id}
 * Used both for editing details and for status transitions
 * (mark completed / close job / reopen) — see backend spec §7.2.
 */
export async function updateClient(id, patch) {
  return request(`/clients/${id}`, { method: "PATCH", body: patch });
}

/** DELETE /api/clients/{id} — cascades to materials and labour */
export async function deleteClient(id) {
  await request(`/clients/${id}`, { method: "DELETE" });
  return true;
}
