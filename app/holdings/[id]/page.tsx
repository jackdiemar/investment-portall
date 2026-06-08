import Link from "next/link";
import { notFound } from "next/navigation";
import { LogoMark } from "@/components/LogoMark";
import { MetricCard } from "@/components/MetricCard";
import { PortalShell } from "@/components/PortalShell";
import { getCashFlows, getInvestment, getInvestmentMetrics } from "@/lib/data";
import { formatCurrency, formatDate, formatMultiple, formatPercent } from "@/lib/format";
import { getSession } from "@/lib/auth";

type InvestmentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InvestmentDetailPage({ params }: InvestmentDetailPageProps) {
  const session = await getSession();
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const [{ data: investment, error }, { data: cashFlows }] = await Promise.all([
    getInvestment(numericId),
    getCashFlows(numericId),
  ]);

  if (!investment) notFound();

  const metrics = getInvestmentMetrics(investment);

  return (
    <PortalShell role={session?.role ?? "portal"}>
      <div className="page-head">
        <div>
          <p className="page-kicker">Investment detail</p>
          <h1>{investment.name}</h1>
        </div>
        <div className="header-actions">
          {session?.role === "admin" ? (
            <Link className="button" href={`/holdings/${investment.id}/edit`}>
              Edit investment
            </Link>
          ) : null}
          <Link className="secondary-button" href="/holdings">
            Back to holdings
          </Link>
        </div>
      </div>

      {error ? <div className="notice">{error}</div> : null}

      <section className="detail-hero">
        <div className="detail-title">
          <LogoMark name={investment.name} logo={investment.logo} />
          <div>
            <h2>{investment.fundName ?? investment.name}</h2>
            <p className="lead">{investment.description ?? "No description has been added."}</p>
          </div>
        </div>
        {investment.website ? (
          <a className="button" href={investment.website} target="_blank" rel="noreferrer">
            Website
          </a>
        ) : null}
      </section>

      <div className="metric-grid">
        <MetricCard label="Committed" value={formatCurrency(investment.amountCommitted, true)} detail="Total commitment" />
        <MetricCard label="Called" value={formatCurrency(investment.amountCalled, true)} detail="Contributed capital" />
        <MetricCard label="Current value" value={formatCurrency(investment.currentValue, true)} detail={formatCurrency(metrics.unrealizedGain, true)} />
        <MetricCard label="MOIC" value={formatMultiple(metrics.moic)} detail={formatPercent(metrics.returnPct)} />
      </div>

      <div className="detail-grid">
        <section className="panel">
          <div className="panel-header">
            <h2>Investment profile</h2>
          </div>
          <div className="panel-body detail-list">
            <div className="detail-row">
              <span className="muted">Category</span>
              <strong>{investment.category}</strong>
            </div>
            <div className="detail-row">
              <span className="muted">Sector</span>
              <strong>{investment.sector ?? "Not set"}</strong>
            </div>
            <div className="detail-row">
              <span className="muted">Investment date</span>
              <strong>{formatDate(investment.investmentDate)}</strong>
            </div>
            <div className="detail-row">
              <span className="muted">Contact</span>
              {investment.contactEmail ? <a className="text-link" href={`mailto:${investment.contactEmail}`}>{investment.contactEmail}</a> : <strong>Not set</strong>}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Cash flows</h2>
          </div>
          {cashFlows.length ? (
            <div className="table-scroll">
              <table className="finance-table">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Type</th>
                    <th className="numeric" scope="col">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cashFlows.map((flow) => (
                    <tr key={flow.id}>
                      <td>{formatDate(flow.flowDate)}</td>
                      <td>{flow.flowType}</td>
                      <td className="numeric">{formatCurrency(flow.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="panel-body muted">No cash flow records have been added for this investment.</div>
          )}
        </section>
      </div>
    </PortalShell>
  );
}
