import { useEffect, useState } from "react";
import { Wallet, TrendingUp, Package, Ban } from "lucide-react";
import StatCard from "../components/common/StatCard";
import LoadingState from "../components/layout/LoadingState";
import { WORK_TYPES, workTypeMeta } from "../constants/workTypes";
import { fmt } from "../utils/format";
import { getSummary, getByClient, getByWorkType } from "../api/reports";

const RANGES = [
  { key: "month", label: "This month" },
  { key: "lastMonth", label: "Last month" },
  { key: "year", label: "This year" },
  { key: "all", label: "All time" },
];

export default function Reports() {
  const [range, setRange] = useState("month");
  const [summary, setSummary] = useState(null);
  const [byClient, setByClient] = useState([]);
  const [byWorkType, setByWorkType] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [s, c, w] = await Promise.all([
        getSummary({ range }),
        getByClient({ range }),
        getByWorkType({ range }),
      ]);
      setSummary(s);
      setByClient(c);
      setByWorkType(w);
      setLoading(false);
    })();
  }, [range]);

  if (loading || !summary) return <LoadingState />;

  const maxClientRevenue = Math.max(1, ...byClient.map((c) => c.revenue));
  const maxWorkTypeRevenue = Math.max(1, ...byWorkType.map((w) => w.revenue));
  const byWorkTypeMap = Object.fromEntries(byWorkType.map((w) => [w.workType, w]));

  return (
    <div className="wl-page">
      <div className="wl-section-head">
        <h2>Reports</h2>
      </div>

      <div className="wl-chip-row mb">
        {RANGES.map((r) => (
          <button
            key={r.key}
            className={"wl-chip" + (range === r.key ? " active" : "")}
            onClick={() => setRange(r.key)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <section className="wl-stats-row reports-row">
        <StatCard icon={Wallet} label="Total revenue" value={fmt(summary.revenue)} tone="ink" />
        <StatCard icon={TrendingUp} label="Your profit (commission)" value={fmt(summary.profit)} tone="green" />
        <StatCard icon={Package} label="Material cost paid" value={fmt(summary.materialCost)} tone="rust" />
        <StatCard icon={Ban} label="Jobs closed (refused/lost)" value={summary.cancelledJobs} tone="stone" />
      </section>
      <p className="wl-muted wl-reports-note">Closed jobs are excluded from revenue and profit above.</p>

      <div className="wl-report-grid">
        <div className="wl-report-card">
          <h3>By work type</h3>
          <div className="wl-bar-list">
            {WORK_TYPES.map((w) => {
              const stat = byWorkTypeMap[w.key] || { revenue: 0 };
              const Icon = w.icon;
              return (
                <div className="wl-bar-row" key={w.key}>
                  <span className="wl-bar-label"><Icon size={14} style={{ color: w.color }} /> {w.label}</span>
                  <div className="wl-bar-track">
                    <div
                      className="wl-bar-fill"
                      style={{ width: `${(stat.revenue / maxWorkTypeRevenue) * 100}%`, background: w.color }}
                    />
                  </div>
                  <span className="wl-bar-value">{fmt(stat.revenue)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="wl-report-card">
          <h3>By client</h3>
          {byClient.length === 0 ? (
            <p className="wl-muted">No activity in this period.</p>
          ) : (
            <div className="wl-bar-list">
              {byClient.map((c) => (
                <div className="wl-bar-row" key={c.clientId}>
                  <span className="wl-bar-label">{c.name}</span>
                  <div className="wl-bar-track">
                    <div
                      className="wl-bar-fill"
                      style={{ width: `${(c.revenue / maxClientRevenue) * 100}%`, background: "#C4622D" }}
                    />
                  </div>
                  <span className="wl-bar-value">{fmt(c.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="wl-report-card full">
        <h3>Profit breakdown</h3>
        <div className="wl-ledger-table report">
          <div className="wl-ledger-row wl-ledger-head">
            <span>Client</span>
            <span>Work</span>
            <span className="num">Revenue</span>
            <span className="num">Your profit</span>
          </div>
          {byClient.length === 0 ? (
            <p className="wl-muted" style={{ padding: "16px 4px" }}>Nothing to show for this period.</p>
          ) : (
            byClient.map((c) => (
              <div className="wl-ledger-row" key={c.clientId}>
                <span className="wl-ledger-primary">{c.name}</span>
                <span className="wl-ledger-muted">{workTypeMeta(c.workType).label}</span>
                <span className="num">{fmt(c.revenue)}</span>
                <span className="num accent-green">{fmt(c.profit)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
