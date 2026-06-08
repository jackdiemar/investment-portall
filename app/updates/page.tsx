import { PortalShell } from "@/components/PortalShell";
import { getDocuments } from "@/lib/data";
import { formatBytes, formatDate } from "@/lib/format";
import { getSession } from "@/lib/auth";

const mockUpdates = [
  {
    name: "Q2 2026 portfolio letter",
    path: "mock/q2-2026-portfolio-letter.pdf",
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01",
    size: 428_000,
    summary: "Portfolio value, capital calls, and recent operating updates across core holdings.",
  },
  {
    name: "May 2026 capital account summary",
    path: "mock/may-2026-capital-account-summary.pdf",
    createdAt: "2026-05-15",
    updatedAt: "2026-05-15",
    size: 312_000,
    summary: "Current value, unfunded commitment, and called capital snapshot by investment.",
  },
  {
    name: "2026 annual meeting notes",
    path: "mock/2026-annual-meeting-notes.pdf",
    createdAt: "2026-04-18",
    updatedAt: "2026-04-18",
    size: 261_000,
    summary: "Notes from manager conversations and investment review discussions.",
  },
];

export default async function UpdatesPage() {
  const session = await getSession();
  const { data: updates, error } = await getDocuments("updates");
  const visibleUpdates = updates.length
    ? updates.map((update) => ({ ...update, summary: "Uploaded investor memo." }))
    : mockUpdates;

  return (
    <PortalShell role={session?.role ?? "portal"}>
      <div className="page-head">
        <div>
          <p className="page-kicker">Updates</p>
          <h1>Investor memos</h1>
          <p className="lead">Investor updates and memos, ordered newest first.</p>
        </div>
      </div>

      {error ? <div className="notice">Showing sample update cards until Supabase files are uploaded.</div> : null}

      <section className="panel">
        <div className="panel-body memo-list">
          {visibleUpdates.map((update) => (
            <article className="memo-row" key={update.path}>
              <div>
                <h3>{update.name}</h3>
                <p className="muted">
                  {formatDate(update.createdAt ?? update.updatedAt)} · {formatBytes(update.size)}
                </p>
                <p className="muted">{update.summary}</p>
              </div>
              {updates.length ? (
                <a className="secondary-button" href={`/data-room/download?bucket=updates&name=${encodeURIComponent(update.path)}`}>
                  Download
                </a>
              ) : (
                <span className="role-badge">Sample</span>
              )}
            </article>
          ))}
        </div>
      </section>
    </PortalShell>
  );
}
