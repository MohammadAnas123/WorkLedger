import { ArrowLeft, Users2, FileBarChart } from "lucide-react";

export default function TopBar({ route, goto }) {
  const isHome = route.name === "dashboard";

  return (
    <header className="wl-topbar">
      <div className="wl-topbar-inner">
        {!isHome ? (
          <button className="wl-icon-btn" onClick={() => goto("dashboard")} aria-label="Back to dashboard">
            <ArrowLeft size={20} />
          </button>
        ) : (
          <div className="wl-brand-mark">WL</div>
        )}
        <div className="wl-brand">
          <span className="wl-brand-title">Work Ledger</span>
          <span className="wl-brand-sub">material · labour · receipts</span>
        </div>
        <nav className="wl-nav">
          <button
            className={"wl-nav-btn" + (route.name === "dashboard" ? " active" : "")}
            onClick={() => goto("dashboard")}
          >
            <Users2 size={16} /> <span>Clients</span>
          </button>
          <button
            className={"wl-nav-btn" + (route.name === "reports" ? " active" : "")}
            onClick={() => goto("reports")}
          >
            <FileBarChart size={16} /> <span>Reports</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
