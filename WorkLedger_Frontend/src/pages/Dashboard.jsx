import { useEffect, useState } from "react";
import { Plus, Search, Wallet, TrendingUp, ClipboardList, X } from "lucide-react";
import StatCard from "../components/common/StatCard";
import EmptyState from "../components/common/EmptyState";
import ClientCard from "../components/client/ClientCard";
import { fmt } from "../utils/format";
import { getDashboardMonthStats } from "../api/dashboard";

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

  .db-root {
    font-family: 'Inter', system-ui, sans-serif;
    background: var(--bg-base);
    color: var(--text-primary);
    min-height: 100vh;
    padding-bottom: env(safe-area-inset-bottom, 24px);
  }

  /* ── hero stats band ── */
  .db-hero {
    position: relative;
    background: #0D1420;
    border-bottom: 1px solid var(--border);
    padding: 20px 16px 24px;
    overflow: hidden;
  }

  /* ruled-paper texture — the signature element */
  .db-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      transparent,
      transparent 27px,
      #1a2233 28px
    );
    opacity: 0.55;
    pointer-events: none;
  }

  .db-hero-label {
    position: relative;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .db-hero-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .db-stats-row {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  @media (min-width: 640px) {
    .db-stats-row { grid-template-columns: repeat(3, 1fr); }
  }

  .db-stat {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: background 0.15s;
  }
  .db-stat:hover { background: var(--bg-card-hover); }

  .db-stat-icon {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .db-stat-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
    line-height: 1.3;
  }
  .db-stat-value {
    font-size: clamp(18px, 4vw, 24px);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  /* revenue — amber */
  .db-stat-revenue .db-stat-icon  { background: var(--amber-bg); color: var(--amber); }
  .db-stat-revenue .db-stat-value { color: var(--amber); }
  /* profit — green */
  .db-stat-profit .db-stat-icon   { background: var(--green-bg); color: var(--green); }
  .db-stat-profit .db-stat-value  { color: var(--green); }
  /* jobs — blue, spans full width on 2-col */
  .db-stat-jobs {
    grid-column: span 2;
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
  @media (min-width: 640px) {
    .db-stat-jobs { grid-column: span 1; flex-direction: column; align-items: flex-start; gap: 6px; }
  }
  .db-stat-jobs .db-stat-icon     { background: var(--blue-bg); color: var(--blue); }
  .db-stat-jobs .db-stat-value    { color: var(--blue); }
  .db-stat-jobs-info { display: flex; flex-direction: column; gap: 4px; }

  /* ── clients section ── */
  .db-clients-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 16px 14px;
    gap: 12px;
  }
  .db-clients-head h2 {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--text-primary);
  }

  .db-new-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--amber);
    color: #1C1100;
    font-size: 13px;
    font-weight: 700;
    padding: 9px 16px;
    border-radius: var(--radius-sm);
    border: none;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: filter 0.15s, transform 0.1s;
  }
  .db-new-btn:hover  { filter: brightness(1.1); }
  .db-new-btn:active { transform: scale(0.97); }

  /* ── toolbar ── */
  .db-toolbar {
    padding: 0 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .db-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0 12px;
    height: 40px;
    transition: border-color 0.15s;
  }
  .db-search:focus-within {
    border-color: var(--amber);
    box-shadow: 0 0 0 2px var(--amber-bg);
  }
  .db-search svg { color: var(--text-muted); flex-shrink: 0; }
  .db-search input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    font-size: 14px;
    color: var(--text-primary);
    font-family: inherit;
  }
  .db-search input::placeholder { color: var(--text-muted); }

  .db-search-clear {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 2px;
    border-radius: 4px;
    transition: color 0.15s;
  }
  .db-search-clear:hover { color: var(--text-secondary); }

  .db-chips {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 2px;
  }
  .db-chips::-webkit-scrollbar { display: none; }

  .db-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    background: var(--bg-card);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .db-chip:hover { background: var(--bg-card-hover); color: var(--text-primary); }
  .db-chip.active {
    background: var(--amber-bg);
    border-color: var(--amber-dim);
    color: var(--amber);
  }
  .db-chip-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.7;
  }

  /* ── result count ── */
  .db-result-count {
    padding: 0 16px 10px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  /* ── client grid ── */
  .db-client-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    padding: 0 16px 24px;
  }
  @media (min-width: 560px) {
    .db-client-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 900px) {
    .db-client-grid { grid-template-columns: repeat(3, 1fr); }
  }

  /* ── responsive gutters ── */
  @media (min-width: 768px) {
    .db-hero            { padding: 28px 28px 32px; }
    .db-clients-head    { padding: 24px 28px 16px; }
    .db-toolbar         { padding: 0 28px 16px; }
    .db-result-count    { padding: 0 28px 10px; }
    .db-client-grid     { padding: 0 28px 32px; }
  }

  /* ── skeleton shimmer for loading stats ── */
  .db-stat-skeleton {
    height: 20px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-card-hover) 50%, var(--bg-elevated) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    width: 70%;
  }
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── empty state ── */
  .db-empty {
    padding: 48px 16px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .db-empty-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    margin-bottom: 4px;
  }
  .db-empty h3 {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
  }
  .db-empty p {
    font-size: 13px;
    color: var(--text-muted);
    max-width: 280px;
    line-height: 1.5;
  }
`;

const FILTERS = [
  { key: "all",         label: "Active" },
  { key: "in_progress", label: "In progress" },
  { key: "completed",   label: "Completed" },
  { key: "cancelled",   label: "Closed" },
];

/* ─────────────────────────── component ─────────────────────────── */
export default function Dashboard({ clients, goto }) {
  const [query, setQuery]         = useState("");
  const [filter, setFilter]       = useState("all");
  const [monthStats, setMonthStats] = useState(null);

  useEffect(() => {
    (async () => {
      const stats = await getDashboardMonthStats();
      setMonthStats(stats);
    })();
  }, [clients]);

  const filtered = clients.filter((c) => {
    const matchesQuery =
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      (c.phone || "").includes(query);
    const matchesFilter =
      filter === "all" ? c.status !== "cancelled" : c.status === filter;
    return matchesQuery && matchesFilter;
  });

  const now = new Date();
  const monthName = now.toLocaleString("default", { month: "long" });

  return (
    <div className="db-root">
      <style>{css}</style>

      {/* ── hero stats ── */}
      <div className="db-hero">
        <div className="db-hero-label">{monthName} at a glance</div>
        <div className="db-stats-row">
          <div className="db-stat db-stat-revenue">
            <div className="db-stat-icon"><Wallet size={15} /></div>
            <div className="db-stat-label">Revenue</div>
            {monthStats
              ? <div className="db-stat-value">{fmt(monthStats.revenue)}</div>
              : <div className="db-stat-skeleton" />}
          </div>

          <div className="db-stat db-stat-profit">
            <div className="db-stat-icon"><TrendingUp size={15} /></div>
            <div className="db-stat-label">Your profit</div>
            {monthStats
              ? <div className="db-stat-value">{fmt(monthStats.profit)}</div>
              : <div className="db-stat-skeleton" />}
          </div>

          <div className="db-stat db-stat-jobs">
            <div className="db-stat-icon"><ClipboardList size={15} /></div>
            <div className="db-stat-jobs-info">
              <div className="db-stat-label">Active jobs</div>
              {monthStats
                ? <div className="db-stat-value">{monthStats.jobs}</div>
                : <div className="db-stat-skeleton" style={{ width: "40%" }} />}
            </div>
          </div>
        </div>
      </div>

      {/* ── clients header ── */}
      <div className="db-clients-head">
        <h2>Clients</h2>
        <button className="db-new-btn" onClick={() => goto("newClient")}>
          <Plus size={15} /> New client
        </button>
      </div>

      {/* ── toolbar ── */}
      <div className="db-toolbar">
        <div className="db-search">
          <Search size={15} />
          <input
            placeholder="Search by name or phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="db-search-clear" onClick={() => setQuery("")}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="db-chips">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={"db-chip" + (filter === f.key ? " active" : "")}
              onClick={() => setFilter(f.key)}
            >
              <span className="db-chip-dot" />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── result count ── */}
      {clients.length > 0 && (
        <div className="db-result-count">
          {filtered.length} {filtered.length === 1 ? "client" : "clients"}
          {query && ` matching "${query}"`}
        </div>
      )}

      {/* ── list ── */}
      {filtered.length === 0 ? (
        <div className="db-empty">
          <div className="db-empty-icon">
            {clients.length === 0
              ? <ClipboardList size={24} />
              : <Search size={24} />}
          </div>
          <h3>{clients.length === 0 ? "No clients yet" : "No matches"}</h3>
          <p>
            {clients.length === 0
              ? "Add your first client to start tracking materials and labour charges."
              : "Try adjusting the search or switching the filter above."}
          </p>
          {clients.length === 0 && (
            <button className="db-new-btn" style={{ marginTop: 8 }} onClick={() => goto("newClient")}>
              <Plus size={15} /> Add first client
            </button>
          )}
        </div>
      ) : (
        <div className="db-client-grid">
          {filtered.map((c) => (
            <ClientCard key={c.id} client={c} onOpen={() => goto("client", { id: c.id })} />
          ))}
        </div>
      )}
    </div>
  );
}