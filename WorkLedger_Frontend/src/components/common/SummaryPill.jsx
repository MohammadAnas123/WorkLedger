export default function SummaryPill({ label, value, accent, big }) {
  return (
    <div className={"wl-pill" + (accent ? ` accent-${accent}` : "") + (big ? " big" : "")}>
      <span className="wl-pill-label">{label}</span>
      <span className="wl-pill-value">{value}</span>
    </div>
  );
}
