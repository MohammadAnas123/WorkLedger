import { request } from "./client";

/**
 * GET /api/clients/{clientId}/receipt
 * Generated on demand — see backend spec §5.5, Option A.
 * Returns just the next display number here; ReceiptView assembles the
 * rest of the receipt itself from materials + labour it already has.
 *
 * If you implement Option B (persisted receipts table) instead, change
 * this to a POST and return the full receipt payload directly.
 */
export async function nextReceiptNo(clientId) {
  const data = await request(`/clients/${clientId}/receipt`, { method: "GET" });
  return data.receiptNo;
}
