import { uploadDataRoomDocument } from "./actions";
import { PortalShell } from "@/components/PortalShell";
import { getDocuments } from "@/lib/data";
import { formatBytes, formatDate } from "@/lib/format";
import { getSession } from "@/lib/auth";

type DataRoomPageProps = {
  searchParams?: Promise<{
    upload?: string;
  }>;
};

function uploadMessage(value: string | undefined) {
  if (value === "success") return "Document uploaded.";
  if (value === "missing") return "Choose a file before uploading.";
  if (value === "failed") return "Upload failed. Check the Supabase storage bucket and environment variables.";
  return null;
}

const mockDocuments = [
  {
    name: "Capital account statement.pdf",
    path: "mock/capital-account-statement.pdf",
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01",
    size: 386_000,
    type: "Statement",
  },
  {
    name: "Subscription documents.zip",
    path: "mock/subscription-documents.zip",
    createdAt: "2026-05-22",
    updatedAt: "2026-05-22",
    size: 1_840_000,
    type: "Legal",
  },
  {
    name: "Tax package 2025.pdf",
    path: "mock/tax-package-2025.pdf",
    createdAt: "2026-04-04",
    updatedAt: "2026-04-04",
    size: 742_000,
    type: "Tax",
  },
  {
    name: "Manager reports folder",
    path: "mock/manager-reports",
    createdAt: "2026-03-28",
    updatedAt: "2026-03-28",
    size: 0,
    type: "Reports",
  },
];

export default async function DataRoomPage({ searchParams }: DataRoomPageProps) {
  const session = await getSession();
  const params = searchParams ? await searchParams : {};
  const message = uploadMessage(params.upload);
  const { data: documents, error } = await getDocuments("data-room");
  const visibleDocuments = documents.length
    ? documents.map((document) => ({ ...document, type: document.mimeType ?? "Document" }))
    : mockDocuments;

  return (
    <PortalShell role={session?.role ?? "portal"}>
      <div className="page-head">
        <div>
          <p className="page-kicker">Data room</p>
          <h1>Documents</h1>
          <p className="lead">Investor documents, statements, tax packages, and manager materials.</p>
        </div>
      </div>

      {error ? <div className="notice">Showing sample data room rows until Supabase files are uploaded.</div> : null}
      {message ? <div className="notice">{message}</div> : null}

      {session?.role === "admin" ? (
        <form className="upload-form" action={uploadDataRoomDocument}>
          <input className="file-input" type="file" name="file" required />
          <button className="button" type="submit">
            Upload document
          </button>
        </form>
      ) : null}

      <section className="panel">
        <div className="panel-body document-list">
          {visibleDocuments.map((document) => (
            <div className="document-row" key={document.path}>
              <div>
                <h3>{document.name}</h3>
                <p className="muted">
                  {document.type} · {formatDate(document.createdAt ?? document.updatedAt)} · {formatBytes(document.size)}
                </p>
              </div>
              {documents.length ? (
                <a className="secondary-button" href={`/data-room/download?bucket=data-room&name=${encodeURIComponent(document.path)}`}>
                  Download
                </a>
              ) : (
                <span className="role-badge">Sample</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </PortalShell>
  );
}
