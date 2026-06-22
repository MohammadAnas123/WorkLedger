/**
 * Sums a list of material rows into real cost / your commission / customer-facing total.
 * customerPrice for each item is always realPrice + commission — this must match
 * whatever the backend computes (see the generated `customer_price` column in the DDL).
 */
export function materialTotals(materials) {
  return materials.reduce(
    (acc, m) => {
      const real = Number(m.realPrice) || 0;
      const comm = Number(m.commission) || 0;
      acc.real += real;
      acc.commission += comm;
      acc.customer += real + comm;
      return acc;
    },
    { real: 0, commission: 0, customer: 0 }
  );
}

export function labourTotal(labour) {
  return labour.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
}
