import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import LoadingState from "../components/layout/LoadingState";
import { workTypeMeta } from "../constants/workTypes";
import { fmt } from "../utils/format";
import { todayISO } from "../utils/date";
import { materialTotals, labourTotal } from "../utils/calculations";
import { getClient } from "../api/clients";
import { listMaterials } from "../api/materials";
import { listLabour } from "../api/labour";
import { nextReceiptNo } from "../api/receipt";

export default function ReceiptView({ clientId, goto }) {
  const [client, setClient] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [labour, setLabour] = useState([]);
  const [receiptNo, setReceiptNo] = useState("");
  const printRef = useRef(null);

  useEffect(() => {
    (async () => {
      const [c, mats, lab, rno] = await Promise.all([
        getClient(clientId),
        listMaterials(clientId),
        listLabour(clientId),
        nextReceiptNo(clientId),
      ]);
      setClient(c);
      setMaterials(mats);
      setLabour(lab);
      setReceiptNo(rno);
    })();
  }, [clientId]);

  if (!client) return <LoadingState />;

  const mt = materialTotals(materials);
  const lt = labourTotal(labour);
  const grand = mt.customer + lt;

  return (
    <div className="wl-receipt-screen">
      <div className="wl-receipt-toolbar no-print">
        <button className="wl-icon-btn" onClick={() => goto("client", { id: clientId })}>
          <ArrowLeft size={20} />
        </button>
        <span className="wl-receipt-toolbar-title">Receipt preview</span>
        <button className="wl-btn wl-btn-primary" onClick={() => window.print()}>
          <Printer size={16} /> Print
        </button>
      </div>

      <div className="wl-receipt-paper" ref={printRef}>
        <div className="wl-receipt-edge" />
        <header className="wl-receipt-head">
          <div className="wl-receipt-brandmark">WL</div>
          <div>
            <h2>Work Ledger</h2>
            <p>Interior &amp; General Maintenance Services</p>
          </div>
          <div className="wl-receipt-no">
            <span>Receipt</span>
            <strong>{receiptNo}</strong>
            <span>{todayISO()}</span>
          </div>
        </header>

        <section className="wl-receipt-bill-to">
          <div>
            <span className="wl-receipt-label">Billed to</span>
            <strong>{client.name}</strong>
            {client.address && <p>{client.address}</p>}
            {client.phone && <p>{client.phone}</p>}
          </div>
          <div>
            <span className="wl-receipt-label">Work</span>
            <strong>{workTypeMeta(client.workType).label}</strong>
            {client.notes && <p>{client.notes}</p>}
          </div>
        </section>

        {materials.length > 0 && (
          <section className="wl-receipt-section">
            <h4>Materials</h4>
            <table className="wl-receipt-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="num">Qty</th>
                  <th className="num">Amount</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.id}>
                    <td>{m.itemName}</td>
                    <td className="num">{m.quantity} {m.unit}</td>
                    <td className="num">{fmt(Number(m.realPrice) + Number(m.commission))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="wl-receipt-subtotal">
              <span>Materials subtotal</span>
              <strong>{fmt(mt.customer)}</strong>
            </div>
          </section>
        )}

        {labour.length > 0 && (
          <section className="wl-receipt-section">
            <h4>Labour</h4>
            <table className="wl-receipt-table">
              <tbody>
                {labour.map((l) => (
                  <tr key={l.id}>
                    <td>{l.description}</td>
                    <td className="num">{fmt(l.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="wl-receipt-subtotal">
              <span>Labour subtotal</span>
              <strong>{fmt(lt)}</strong>
            </div>
          </section>
        )}

        <div className="wl-receipt-grand">
          <span>Total amount payable</span>
          <strong>{fmt(grand)}</strong>
        </div>

        <footer className="wl-receipt-foot">
          <p>Thank you for trusting us with your work.</p>
          <p className="wl-receipt-stamp">PAID</p>
        </footer>
      </div>
    </div>
  );
}
