import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { formatCurrency, formatDate, formatMultiple, formatPercent } from "@/lib/format";
import { getInvestmentMetrics } from "@/lib/data";
import type { Investment } from "@/lib/supabase";

export type HoldingSortKey =
  | "name"
  | "category"
  | "sector"
  | "investment_date"
  | "amount_committed"
  | "amount_called"
  | "current_value"
  | "moic"
  | "return";

export type SortDirection = "asc" | "desc";

const headers: { key: HoldingSortKey; label: string; align?: "right" }[] = [
  { key: "name", label: "Investment" },
  { key: "category", label: "Category" },
  { key: "sector", label: "Sector" },
  { key: "investment_date", label: "Date" },
  { key: "amount_committed", label: "Committed", align: "right" },
  { key: "amount_called", label: "Called", align: "right" },
  { key: "current_value", label: "Current value", align: "right" },
  { key: "moic", label: "MOIC", align: "right" },
  { key: "return", label: "Return", align: "right" },
];

export function HoldingsTable({
  investments,
  sort,
  direction,
  showAdminActions = true,
}: {
  investments: Investment[];
  sort: HoldingSortKey;
  direction: SortDirection;
  showAdminActions?: boolean;
}) {
  const nextDirection = (key: HoldingSortKey) => (sort === key && direction === "asc" ? "desc" : "asc");

  return (
    <div className="table-scroll">
      <table className="finance-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.key} className={header.align === "right" ? "numeric" : undefined} scope="col">
                <Link href={`/holdings?sort=${header.key}&direction=${nextDirection(header.key)}`}>
                  {header.label}
                  {sort === header.key ? <span aria-hidden="true">{direction === "asc" ? " ↑" : " ↓"}</span> : null}
                </Link>
              </th>
            ))}
            {showAdminActions ? <th className="numeric" scope="col">Edit</th> : null}
          </tr>
        </thead>
        <tbody>
          {investments.map((investment) => {
            const metrics = getInvestmentMetrics(investment);
            return (
              <tr key={investment.id}>
                <td>
                  <Link className="holding-link" href={`/holdings/${investment.id}`}>
                    <LogoMark name={investment.name} logo={investment.logo} />
                    <span>
                      <strong>{investment.name}</strong>
                      <small>{investment.fundName ?? "Direct position"}</small>
                    </span>
                  </Link>
                </td>
                <td>{investment.category}</td>
                <td>{investment.sector ?? "Not set"}</td>
                <td>{formatDate(investment.investmentDate)}</td>
                <td className="numeric">{formatCurrency(investment.amountCommitted)}</td>
                <td className="numeric">{formatCurrency(investment.amountCalled)}</td>
                <td className="numeric">{formatCurrency(investment.currentValue)}</td>
                <td className="numeric">{formatMultiple(metrics.moic)}</td>
                <td className="numeric">{formatPercent(metrics.returnPct)}</td>
                {showAdminActions ? (
                  <td className="numeric">
                    <Link className="text-link" href={`/holdings/${investment.id}/edit`}>
                      Edit
                    </Link>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
