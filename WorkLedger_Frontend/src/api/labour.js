import { request } from "./client";

/** GET /api/clients/{clientId}/labour */
export async function listLabour(clientId) {
  return request(`/clients/${clientId}/labour`);
}

/** POST /api/clients/{clientId}/labour */
export async function addLabour(clientId, payload) {
  return request(`/clients/${clientId}/labour`, { method: "POST", body: payload });
}

/** DELETE /api/labour/{id} */
export async function deleteLabour(id) {
  await request(`/labour/${id}`, { method: "DELETE" });
  return true;
}
