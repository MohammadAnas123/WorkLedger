import { useEffect, useState } from "react";
import { Wallet, TrendingUp, Package, Ban, ChevronUp, ChevronDown, Minus } from "lucide-react";
import LoadingState from "../components/layout/LoadingState";
import { WORK_TYPES, workTypeMeta } from "../constants/workTypes";
import { fmt } from "../utils/format";
import { getSummary, getByClient, getByWorkType } from "../api/reports";

/* ─────────────────────────── styles ─────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  :root {
    --bg-base:        #111827;
    --bg-card:        #1F2937;
    --bg-card-hover:  #263041;
    --bg-elevated:    #374151;
    --border:         #374151;
    --text-primary:   #F9FAFB;
    --text-secondary: #9CA3AF;
    --text-muted:     #6B7280;
    --amber:          #F59E0B;
    --amber-dim:      #78350F;
    --amber-bg:       #1C1100;
    --green:          #34D399;
    --green-dim:      #064E3B;
    --green-bg:       #011C14;
    --rose:           #FB7185;
    --rose-dim:       #881337;
    --rose-bg:        #1C0009;
    --blue:           #60A5FA;
    --blue-bg:        #0C1C35;
    --radius-sm:      8px;
    --radius-md:      12px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rp-root {
    font-family: 'Inter', system-ui, sans-serif;
    background: var(--bg-base);
    color: var(--text-primary);
    min-height: 100vh;
    padding-bottom: env(safe-area-inset-bottom, 32px);
  }

  /* ── page head ── */
  .rp-head {
    padding: 20px 16px 0;
  }
  .rp-head h2 {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }
  .rp-head-sub {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
  }
  @media (min-width: 768px) {
    .rp-head { padding: 28px 28px 0; }
  }

  /* ── range chips ── */
  .rp-chips {
    display: flex;
    gap: 6px;
    padding: 14px 16px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .rp-chips::-webkit-scrollbar { display: none; }
  .rp-chip {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    font-family: inherit;
    background: var(--bg-card);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .rp-chip:hover { background: var(--bg-card-hover); color: var(--text-primary); }
  .rp-chip.active {
    background: var(--amber-bg);
    border-color: var(--amber-dim);
    color: var(--amber);
  }
  @media (min-width: 768px) {
    .rp-chips { padding: 16px 28px; }
  }

  /* ── stat cards ── */
  .rp-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding: 0 16px 20px;
  }
  @media (min-width: 640px) {
    .rp-stats { grid-template-columns: repeat(4, 1fr); }
  }
  @media (min-width: 768px) {
    .rp-stats { padding: 0 28px 24px; }
  }

  .rp-stat {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .rp-stat-icon {
    width: 28px; height: 28px;
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 2px;
  }
  .rp-stat-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
    line-height: 1.3;
  }
  .rp-stat-value {
    font-size: clamp(17px, 3.5vw, 22px);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .rp-stat-note {
    font-size: 10px;
    color: var(--text-muted);
    margin-top: 1px;
  }

  .rp-stat-amber .rp-stat-icon  { background: var(--amber-bg); color: var(--amber); }
  .rp-stat-amber .rp-stat-value { color: var(--amber); }
  .rp-stat-green .rp-stat-icon  { background: var(--green-bg); color: var(--green); }
  .rp-stat-green .rp-stat-value { color: var(--green); }
  .rp-stat-blue .rp-stat-icon   { background: var(--blue-bg);  color: var(--blue); }
  .rp-stat-blue .rp-stat-value  { color: var(--blue); }
  .rp-stat-muted .rp-stat-icon  { background: var(--bg-elevated); color: var(--text-muted); }
  .rp-stat-muted .rp-stat-value { color: var(--text-secondary); }

  /* ── margin % badge on profit card ── */
  .rp-margin-badge {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 999px;
    background: var(--green-bg);
    color: var(--green);
    border: 1px solid var(--green-dim);
    width: fit-content;
  }

  /* ── section note ── */
  .rp-note {
    padding: 0 16px 16px;
    font-size: 11px;
    color: var(--text-muted);
  }
  @media (min-width: 768px) { .rp-note { padding: 0 28px 20px; } }

  /* ── two-col report grid ── */
  .rp-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 0 16px 12px;
  }
  @media (min-width: 720px) {
    .rp-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (min-width: 768px) {
    .rp-grid { padding: 0 28px 12px; }
  }

  /* ── card ── */
  .rp-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
  }
  .rp-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 12px;
    border-bottom: 1px solid var(--border);
  }
  .rp-card-head h3 {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .rp-card-count {
    font-size: 10px;
    font-weight: 700;
    background: var(--bg-elevated);
    color: var(--text-muted);
    padding: 2px 7px;
    border-radius: 999px;
  }
  .rp-card-body { padding: 12px 16px 14px; }

  /* ── bar list ── */
  .rp-bar-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .rp-bar-row {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    gap: 4px 8px;
    align-items: center;
  }
  .rp-bar-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .rp-bar-value {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-primary);
    text-align: right;
    white-space: nowrap;
  }
  .rp-bar-track {
    grid-column: 1 / -1;
    height: 5px;
    background: var(--bg-elevated);
    border-radius: 999px;
    overflow: hidden;
  }
  .rp-bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    min-width: 2px;
  }
  .rp-empty {
    font-size: 13px;
    color: var(--text-muted);
    padding: 8px 0;
  }

  /* ── profit breakdown table ── */
  .rp-breakdown {
    padding: 0 16px 16px;
  }
  @media (min-width: 768px) { .rp-breakdown { padding: 0 28px 24px; } }

  .rp-breakdown-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
  }
  .rp-breakdown-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 12px;
    border-bottom: 1px solid var(--border);
  }
  .rp-breakdown-head h3 {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  /* sortable column headers */
  .rp-table-head {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 8px;
    padding: 8px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--bg-base);
  }
  .rp-th {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 3px;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    transition: color 0.15s;
  }
  .rp-th:hover { color: var(--text-secondary); }
  .rp-th.active { color: var(--amber); }
  .rp-th-num { justify-content: flex-end; }

  /* hide work type col on very small screens */
  .rp-col-work { display: none; }
  @media (min-width: 420px) { .rp-col-work { display: flex; } }

  .rp-table-row {
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 8px;
    align-items: center;
    padding: 11px 16px;
    border-bottom: 1px solid var(--border);
    transition: background 0.1s;
  }
  .rp-table-row:last-child { border-bottom: none; }
  .rp-table-row:hover { background: var(--bg-card-hover); }

  .rp-td-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .rp-td-work {
    display: none;
    font-size: 11px;
    color: var(--text-muted);
    white-space: nowrap;
  }
  @media (min-width: 420px) { .rp-td-work { display: block; } }

  .rp-td-rev {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    text-align: right;
    white-space: nowrap;
  }
  .rp-td-profit {
    font-size: 13px;
    font-weight: 700;
    color: var(--green);
    text-align: right;
    white-space: nowrap;
  }

  .rp-table-empty {
    padding: 20px 16px;
    font-size: 13px;
    color: var(--text-muted);
  }
`;

/* ─────────────────────────── sort hook ─────────────────────────── */
function useSorted(rows, defaultKey = "revenue") {
  const [key, setKey]   = useState(defaultKey);
  const [asc, setAsc]   = useState(false);

  const toggle = (k) => {
    if (k === key) setAsc((a) => !a);
    else { setKey(k); setAsc(false); }
  };

  const sorted = [...rows].sort((a, b) => {
    const av = a[key] ?? 0;
    const bv = b[key] ?? 0;
    const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
    return asc ? cmp : -cmp;
  });

  return { sorted, key, asc, toggle };
}

function SortIcon({ active, asc }) {
  if (!active) return <Minus size={10} opacity={0.3} />;
  return asc ? <ChevronUp size={10} /> : <ChevronDown size={10} />;
}

const RANGES = [
  { key: "month",     label: "This month" },
  { key: "lastMonth", label: "Last month" },
  { key: "year",      label: "This year" },
  { key: "all",       label: "All time" },
];

/* ─────────────────────────── component ─────────────────────────── */
export default function Reports() {
  const [range, setRange]         = useState("month");
  const [summary, setSummary]     = useState(null);
  const [byClient, setByClient]   = useState([]);
  const [byWorkType, setByWorkType] = useState([]);
  const [loading, setLoading]     = useState(true);

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

  const { sorted, key: sortKey, asc: sortAsc, toggle } = useSorted(byClient);

  if (loading || !summary) return <LoadingState />;

  const maxClientRevenue   = Math.max(1, ...byClient.map((c) => c.revenue));
  const maxWorkTypeRevenue = Math.max(1, ...byWorkType.map((w) => w.revenue));
  const byWorkTypeMap      = Object.fromEntries(byWorkType.map((w) => [w.workType, w]));
  const marginPct          = summary.revenue > 0
    ? Math.round((summary.profit / summary.revenue) * 100)
    : 0;

  const rangeLabel = RANGES.find((r) => r.key === range)?.label ?? "";

  return (
    <div className="rp-root">
      <style>{css}</style>

      {/* ── head ── */}
      <div className="rp-head">
        <h2>Reports</h2>
        <p className="rp-head-sub">{rangeLabel}</p>
      </div>

      {/* ── range chips ── */}
      <div className="rp-chips">
        {RANGES.map((r) => (
          <button
            key={r.key}
            className={"rp-chip" + (range === r.key ? " active" : "")}
            onClick={() => setRange(r.key)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* ── stat cards ── */}
      <div className="rp-stats">
        <div className="rp-stat rp-stat-amber">
          <div className="rp-stat-icon"><Wallet size={14} /></div>
          <div className="rp-stat-label">Total revenue</div>
          <div className="rp-stat-value">{fmt(summary.revenue)}</div>
        </div>

        <div className="rp-stat rp-stat-green">
          <div className="rp-stat-icon"><TrendingUp size={14} /></div>
          <div className="rp-stat-label">Your profit</div>
          <div className="rp-stat-value">{fmt(summary.profit)}</div>
          {marginPct > 0 && (
            <div className="rp-margin-badge">
              <TrendingUp size={9} /> {marginPct}% margin
            </div>
          )}
        </div>

        <div className="rp-stat rp-stat-blue">
          <div className="rp-stat-icon"><Package size={14} /></div>
          <div className="rp-stat-label">Material cost</div>
          <div className="rp-stat-value">{fmt(summary.materialCost)}</div>
        </div>

        <div className="rp-stat rp-stat-muted">
          <div className="rp-stat-icon"><Ban size={14} /></div>
          <div className="rp-stat-label">Jobs closed</div>
          <div className="rp-stat-value">{summary.cancelledJobs}</div>
          <div className="rp-stat-note">Excluded from above</div>
        </div>
      </div>

      {/* ── bar charts ── */}
      <div className="rp-grid">
        {/* by work type */}
        <div className="rp-card">
          <div className="rp-card-head">
            <h3>By work type</h3>
            <span className="rp-card-count">{WORK_TYPES.length} types</span>
          </div>
          <div className="rp-card-body">
            <div className="rp-bar-list">
              {WORK_TYPES.map((w) => {
                const stat = byWorkTypeMap[w.key] || { revenue: 0 };
                const Icon = w.icon;
                const pct  = (stat.revenue / maxWorkTypeRevenue) * 100;
                return (
                  <div className="rp-bar-row" key={w.key}>
                    <span className="rp-bar-label">
                      <Icon size={13} style={{ color: w.color, flexShrink: 0 }} />
                      {w.label}
                    </span>
                    <span className="rp-bar-value">{fmt(stat.revenue)}</span>
                    <div className="rp-bar-track">
                      <div
                        className="rp-bar-fill"
                        style={{ width: `${pct}%`, background: w.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* by client */}
        <div className="rp-card">
          <div className="rp-card-head">
            <h3>By client</h3>
            <span className="rp-card-count">{byClient.length} clients</span>
          </div>
          <div className="rp-card-body">
            {byClient.length === 0 ? (
              <p className="rp-empty">No activity in this period.</p>
            ) : (
              <div className="rp-bar-list">
                {byClient.map((c) => {
                  const pct = (c.revenue / maxClientRevenue) * 100;
                  return (
                    <div className="rp-bar-row" key={c.clientId}>
                      <span className="rp-bar-label">{c.name}</span>
                      <span className="rp-bar-value">{fmt(c.revenue)}</span>
                      <div className="rp-bar-track">
                        <div
                          className="rp-bar-fill"
                          style={{ width: `${pct}%`, background: "var(--amber)" }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── profit breakdown table ── */}
      <div className="rp-breakdown">
        <div className="rp-breakdown-card">
          <div className="rp-breakdown-head">
            <h3>Profit breakdown</h3>
          </div>

          {byClient.length === 0 ? (
            <div className="rp-table-empty">Nothing to show for this period.</div>
          ) : (
            <>
              <div className="rp-table-head">
                <button className={"rp-th" + (sortKey === "name" ? " active" : "")} onClick={() => toggle("name")}>
                  Client <SortIcon active={sortKey === "name"} asc={sortAsc} />
                </button>
                <button className={"rp-th rp-col-work"} style={{ cursor: "default" }}>
                  Work
                </button>
                <button className={"rp-th rp-th-num" + (sortKey === "revenue" ? " active" : "")} onClick={() => toggle("revenue")}>
                  Revenue <SortIcon active={sortKey === "revenue"} asc={sortAsc} />
                </button>
                <button className={"rp-th rp-th-num" + (sortKey === "profit" ? " active" : "")} onClick={() => toggle("profit")}>
                  Profit <SortIcon active={sortKey === "profit"} asc={sortAsc} />
                </button>
              </div>
              {sorted.map((c) => (
                <div className="rp-table-row" key={c.clientId}>
                  <span className="rp-td-name">{c.name}</span>
                  <span className="rp-td-work rp-col-work">{workTypeMeta(c.workType).label}</span>
                  <span className="rp-td-rev">{fmt(c.revenue)}</span>
                  <span className="rp-td-profit">{fmt(c.profit)}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}