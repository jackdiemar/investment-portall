import { HoldingsTable, type HoldingSortKey, type SortDirection } from "@/components/HoldingsTable";
import { PortalShell } from "@/components/PortalShell";
import { getInvestmentMetrics, getInvestments } from "@/lib/data";
import { getSession } from "@/lib/auth";

const sortKeys = new Set<HoldingSortKey>([
  "name",
  "category",
  "sector",
  "investment_date",
  "amount_committed",
  "amount_called",
  "current_value",
  "moic",
  "return",
]);

type HoldingsPageProps = {
  searchParams?: Promise<{
    sort?: string;
    direction?: string;
  }>;
};

export default async function HoldingsPage({ searchParams }: HoldingsPageProps) {
  const session = await getSession();
  const params = searchParams ? await searchParams : {};
  const sort = sortKeys.has(params.sort as HoldingSortKey) ? (params.sort as HoldingSortKey) : "current_value";
  const direction: SortDirection = params.direction === "asc" ? "asc" : "desc";
  const { data: investments, error } = await getInvestments();

  const sorted = [...investments].sort((a, b) => {
    const multiplier = direction === "asc" ? 1 : -1;
    const aMetrics = getInvestmentMetrics(a);
    const bMetrics = getInvestmentMetrics(b);

    const values: Record<HoldingSortKey, [string | number | null, string | number | null]> = {
      name: [a.name, b.name],
      category: [a.category, b.category],
      sector: [a.sector, b.sector],
      investment_date: [a.investmentDate, b.investmentDate],
      amount_committed: [a.amountCommitted, b.amountCommitted],
      amount_called: [a.amountCalled, b.amountCalled],
      current_value: [a.currentValue, b.currentValue],
      moic: [aMetrics.moic, bMetrics.moic],
      return: [aMetrics.returnPct, bMetrics.returnPct],
    };

    const [left, right] = values[sort];
    if (typeof left === "number" && typeof right === "number") return (left - right) * multiplier;
    return String(left ?? "").localeCompare(String(right ?? "")) * multiplier;
  });

  return (
    <PortalShell role={session?.role ?? "portal"}>
      <div className="page-head">
        <div>
          <p className="page-kicker">Holdings</p>
          <h1>Investment ledger</h1>
          <p className="lead">A sortable view of all investments, commitments, called capital, current value, and returns.</p>
        </div>
      </div>

      {error ? <div className="notice">Showing local portfolio data until Supabase is fully connected.</div> : null}
      <HoldingsTable investments={sorted} sort={sort} direction={direction} showAdminActions={session?.role === "admin"} />
    </PortalShell>
  );
}
