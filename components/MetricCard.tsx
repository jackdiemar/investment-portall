export function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <section className="metric-card">
      <p className="eyebrow">{label}</p>
      <p className="metric-value">{value}</p>
      <p className="muted">{detail}</p>
    </section>
  );
}
