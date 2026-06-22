export const CANCEL_REASONS = [
  { key: "client_refused", label: "Client refused / backed out" },
  { key: "hired_other", label: "Client hired someone else" },
  { key: "price_disagreement", label: "Could not agree on price" },
  { key: "other", label: "Other" },
];

export const cancelReasonLabel = (key) =>
  CANCEL_REASONS.find((r) => r.key === key)?.label || "Not specified";
