import { useEffect, useState } from "react";
import { Plus, Search, Wallet, TrendingUp, ClipboardList } from "lucide-react";
import StatCard from "../components/common/StatCard";
import EmptyState from "../components/common/EmptyState";
import ClientCard from "../components/client/ClientCard";
import { fmt } from "../utils/format";
import { getDashboardMonthStats } from "../api/dashboard";

export default function Dashboard({ clients, goto }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("in_progress");
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

  return (
    <div className="wl-page">
      <section className="wl-stats-row">
        <StatCard
          icon={Wallet}
          label="This month — revenue"
          value={monthStats ? fmt(monthStats.revenue) : "—"}
          tone="ink"
        />
        <StatCard
          icon={TrendingUp}
          label="This month — your profit"
          value={monthStats ? fmt(monthStats.profit) : "—"}
          tone="green"
        />
        <StatCard
          icon={ClipboardList}
          label="Active jobs this month"
          value={monthStats ? monthStats.jobs : "—"}
          tone="rust"
        />
      </section>

      <section className="wl-section-head">
        <h2>Clients</h2>
        <button className="wl-btn wl-btn-primary" onClick={() => goto("newClient")}>
          <Plus size={18} /> New client
        </button>
      </section>

      <div className="wl-toolbar">
        <div className="wl-search">
          <Search size={16} />
          <input
            placeholder="Search by name or phone…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="wl-chip-row">
          {[
            { key: "in_progress", label: "In progress" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" },
            { key: "all", label: "All" },
          ].map((f) => (
            <button
              key={f.key}
              className={"wl-chip" + (filter === f.key ? " active" : "")}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={clients.length === 0 ? "No clients yet" : "No matches"}
          subtitle={
            clients.length === 0
              ? "Add your first client to start tracking material and labour."
              : "Try a different search or filter."
          }
          action={
            clients.length === 0 && (
              <button className="wl-btn wl-btn-primary" onClick={() => goto("newClient")}>
                <Plus size={18} /> Add a client
              </button>
            )
          }
        />
      ) : (
        <div className="wl-client-grid">
          {filtered.map((c) => (
            <ClientCard key={c.id} client={c} onOpen={() => goto("client", { id: c.id })} />
          ))}
        </div>
      )}
    </div>
  );
}
