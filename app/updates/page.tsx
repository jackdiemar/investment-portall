import { PortalShell } from "@/components/PortalShell";
import { getDocuments } from "@/lib/data";
import { formatBytes, formatDate } from "@/lib/format";
import { requireSession } from "@/lib/auth";

export default async function UpdatesPage() {
  const session = await requireSession();
  const { data: updates, error } = await getDocuments("updates");

  return (
    <PortalShell role={session.role}>
      <div className="page-head">
        <div>
          <p className="page-kicker">Updates</p>
          <h1>Investor memos</h1>
          <p className="lead">Storage-backed investor updates and memos, ordered newest first.</p>
        </div>
      </div>

      {error ? <div className="notice">{error}</div> : null}

      {updates.length ? (
        <section className="panel">
          <div className="panel-body memo-list">
            {updates.map((update) => (
              <article className="memo-row" key={update.path}>
                <div>
                  <h3>{update.name}</h3>
                  <p className="muted">
                    {formatDate(update.createdAt ?? update.updatedAt)} · {formatBytes(update.size)}
                  </p>
                </div>
                <a className="secondary-button" href={`/data-room/download?bucket=updates&name=${encodeURIComponent(update.path)}`}>
                  Download
                </a>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <div className="empty-state">No investor memos have been uploaded yet.</div>
      )}
    </PortalShell>
  );
}
