import Link from "next/link";
import { MetricCard } from "@/components/MetricCard";
import { PortalShell } from "@/components/PortalShell";
import { getInvestments, getPortfolioMetrics } from "@/lib/data";
import { formatCurrency, formatMultiple, formatPercent } from "@/lib/format";
import { getSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getSession();
  const { data: investments, error } = await getInvestments();
  const metrics = getPortfolioMetrics(investments);

  const topHoldings = [...investments].sort((a, b) => b.currentValue - a.currentValue).slice(0, 8);
  const categoryRows = Object.entries(
    investments.reduce<Record<string, number>>((acc, investment) => {
      acc[investment.category] = (acc[investment.category] ?? 0) + investment.currentValue;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <PortalShell role={session?.role ?? "portal"}>
      <div className="page-head">
        <div>
          <p className="page-kicker">Dashboard</p>
          <h1>Capital summary</h1>
          <p className="lead">Committed capital, called capital, current value, and multiple on invested capital.</p>
        </div>
        <Link className="secondary-button" href="/holdings">
          View holdings
        </Link>
      </div>

      {error ? <div className="notice">Showing local portfolio data until Supabase is fully connected.</div> : null}

      <div className="metric-grid">
        <MetricCard label="Committed" value={formatCurrency(metrics.committed, true)} detail="Total capital commitment" />
        <MetricCard label="Called" value={formatCurrency(metrics.called, true)} detail="Capital contributed to date" />
        <MetricCard label="Current value" value={formatCurrency(metrics.currentValue, true)} detail={`${metrics.count} active positions`} />
        <MetricCard label="MOIC" value={formatMultiple(metrics.moic)} detail={formatPercent(metrics.returnPct)} />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <h2>Holdings overview</h2>
            <span className="eyebrow">Top positions</span>
          </div>
          <div className="table-scroll">
            <table className="finance-table">
              <thead>
                <tr>
                  <th scope="col">Investment</th>
                  <th scope="col">Category</th>
                  <th className="numeric" scope="col">
                    Current value
                  </th>
                  <th className="numeric" scope="col">
                    Called
                  </th>
                  {session?.role === "admin" ? <th className="numeric" scope="col">Edit</th> : null}
                </tr>
              </thead>
              <tbody>
                {topHoldings.map((investment) => (
                  <tr key={investment.id}>
                    <td>
                      <Link href={`/holdings/${investment.id}`}>{investment.name}</Link>
                    </td>
                    <td>{investment.category}</td>
                    <td className="numeric">{formatCurrency(investment.currentValue)}</td>
                    <td className="numeric">{formatCurrency(investment.amountCalled)}</td>
                    {session?.role === "admin" ? (
                      <td className="numeric">
                        <Link className="text-link" href={`/holdings/${investment.id}/edit`}>
                          Edit
                        </Link>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="panel">
          <div className="panel-header">
            <h2>Allocation</h2>
            <span className="eyebrow">By category</span>
          </div>
          <div className="panel-body category-list">
            {categoryRows.map(([category, value]) => (
              <div className="category-row" key={category}>
                <span>{category}</span>
                <strong className="numeric">{formatCurrency(value, true)}</strong>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </PortalShell>
  );
}
