import { uploadDataRoomDocument } from "./actions";
import { PortalShell } from "@/components/PortalShell";
import { getDocuments } from "@/lib/data";
import { formatBytes, formatDate } from "@/lib/format";
import { requireSession } from "@/lib/auth";

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

export default async function DataRoomPage({ searchParams }: DataRoomPageProps) {
  const session = await requireSession();
  const params = searchParams ? await searchParams : {};
  const message = uploadMessage(params.upload);
  const { data: documents, error } = await getDocuments("data-room");

  return (
    <PortalShell role={session.role}>
      <div className="page-head">
        <div>
          <p className="page-kicker">Data room</p>
          <h1>Documents</h1>
          <p className="lead">Upload and download investor documents through Supabase Storage.</p>
        </div>
      </div>

      {error ? <div className="notice">{error}</div> : null}
      {message ? <div className="notice">{message}</div> : null}

      {session.role === "admin" ? (
        <form className="upload-form" action={uploadDataRoomDocument}>
          <input className="file-input" type="file" name="file" required />
          <button className="button" type="submit">
            Upload document
          </button>
        </form>
      ) : null}

      {documents.length ? (
        <section className="panel">
          <div className="panel-body document-list">
            {documents.map((document) => (
              <div className="document-row" key={document.path}>
                <div>
                  <h3>{document.name}</h3>
                  <p className="muted">
                    {formatDate(document.createdAt ?? document.updatedAt)} · {formatBytes(document.size)}
                  </p>
                </div>
                <a className="secondary-button" href={`/data-room/download?bucket=data-room&name=${encodeURIComponent(document.path)}`}>
                  Download
                </a>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="empty-state">No data room documents have been uploaded yet.</div>
      )}
    </PortalShell>
  );
}
