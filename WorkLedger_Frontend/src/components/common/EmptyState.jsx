export default function EmptyState({ title, subtitle, action }) {
  return (
    <div className="wl-empty">
      <div className="wl-empty-mark" />
      <h3>{title}</h3>
      <p>{subtitle}</p>
      {action}
    </div>
  );
}
