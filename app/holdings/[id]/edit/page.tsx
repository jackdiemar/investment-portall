import Link from "next/link";
import { notFound } from "next/navigation";
import { updateInvestmentAction } from "./actions";
import { PortalShell } from "@/components/PortalShell";
import { getSession } from "@/lib/auth";
import { getInvestment } from "@/lib/data";

type EditInvestmentPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function EditInvestmentPage({ params, searchParams }: EditInvestmentPageProps) {
  const session = await getSession();
  const query = searchParams ? await searchParams : {};
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const { data: investment, error } = await getInvestment(numericId);
  if (!investment) notFound();

  const action = updateInvestmentAction.bind(null, investment.id);

  return (
    <PortalShell role={session?.role ?? "portal"}>
      <div className="page-head">
        <div>
          <p className="page-kicker">Admin edit</p>
          <h1>{investment.name}</h1>
          <p className="lead">Update the investment record stored in Supabase.</p>
        </div>
        <Link className="secondary-button" href={`/holdings/${investment.id}`}>
          Cancel
        </Link>
      </div>

      {error ? <div className="notice">Showing local portfolio data until Supabase is fully connected.</div> : null}
      {query.error === "admin" ? <div className="notice">Admin password required to save changes.</div> : null}

      <form className="panel edit-form" action={action}>
        <div className="form-grid">
          <label>
            Name
            <input name="name" defaultValue={investment.name} required />
          </label>
          <label>
            Category
            <input name="category" defaultValue={investment.category} required />
          </label>
          <label>
            Fund name
            <input name="fund_name" defaultValue={investment.fundName ?? ""} />
          </label>
          <label>
            Sector
            <input name="sector" defaultValue={investment.sector ?? ""} />
          </label>
          <label>
            Logo path or URL
            <input name="logo" defaultValue={investment.logo ?? ""} />
          </label>
          <label>
            Website
            <input name="website" defaultValue={investment.website ?? ""} />
          </label>
          <label>
            Contact email
            <input name="contact_email" type="email" defaultValue={investment.contactEmail ?? ""} />
          </label>
          <label>
            Investment date
            <input name="investment_date" defaultValue={investment.investmentDate ?? ""} />
          </label>
          <label>
            Amount committed
            <input name="amount_committed" type="number" step="0.01" defaultValue={investment.amountCommitted} required />
          </label>
          <label>
            Amount called
            <input name="amount_called" type="number" step="0.01" defaultValue={investment.amountCalled} required />
          </label>
          <label>
            Current value
            <input name="current_value" type="number" step="0.01" defaultValue={investment.currentValue} required />
          </label>
          <label className="full-width">
            Description
            <textarea name="description" rows={5} defaultValue={investment.description ?? ""} />
          </label>
        </div>
        <div className="form-actions">
          <button className="button" type="submit">
            Save investment
          </button>
          <Link className="secondary-button" href={`/holdings/${investment.id}`}>
            Cancel
          </Link>
        </div>
      </form>
    </PortalShell>
  );
}
