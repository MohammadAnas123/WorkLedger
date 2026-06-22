import { request } from "./client";

/** GET /api/clients/{clientId}/materials */
export async function listMaterials(clientId) {
  return request(`/clients/${clientId}/materials`);
}

/**
 * POST /api/clients/{clientId}/materials
 * customerPrice is never sent — the backend always computes it as
 * realPrice + commission (see backend spec §3.3 / §7.1).
 */
export async function addMaterial(clientId, payload) {
  return request(`/clients/${clientId}/materials`, { method: "POST", body: payload });
}

/** DELETE /api/materials/{id} */
export async function deleteMaterial(id) {
  await request(`/materials/${id}`, { method: "DELETE" });
  return true;
}
