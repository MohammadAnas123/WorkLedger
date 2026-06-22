export default function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className={`wl-stat-card tone-${tone}`}>
      <div className="wl-stat-icon">
        <Icon size={20} />
      </div>
      <div>
        <div className="wl-stat-value">{value}</div>
        <div className="wl-stat-label">{label}</div>
      </div>
    </div>
  );
}
