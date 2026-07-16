import { useDocumentsQuery, type Patient } from "../../services/api";
import { Icon } from "../app/Icon";
import { KIND_LABELS, statusLabel } from "./kinds";

function statusStyle(status: string): { background: string; color: string } {
  if (status === "completed") return { background: "var(--aayu-success-bg)", color: "var(--aayu-teal-800)" };
  if (status === "failed") return { background: "var(--aayu-danger-bg)", color: "var(--aayu-danger)" };
  return { background: "var(--aayu-surface-muted)", color: "var(--aayu-text-secondary)" };
}

export function DocumentsScreen({ patient, onBack, onAdd }: { patient: Patient | null; onBack: () => void; onAdd: () => void }) {
  const { data: documents = [], isLoading } = useDocumentsQuery(patient?.id ?? "", {
    skip: !patient?.id,
    refetchOnMountOrArgChange: true,
  });

  return (
    <section aria-labelledby="documents-title" className="grid gap-4">
      <button type="button" onClick={onBack} className="inline-flex w-fit items-center gap-1 text-sm font-medium text-[#0F6E56]">
        ← Back to dashboard
      </button>
      <div className="flex items-center justify-between gap-3">
        <h1 id="documents-title" className="text-3xl font-medium text-[#042C53]">Documents</h1>
        <button type="button" onClick={onAdd} className="primary-button inline-flex items-center gap-1.5" style={{ padding: "10px 16px" }}>
          <Icon name="plus" size={16} color="#fff" /> Add a document
        </button>
      </div>

      {isLoading && <div className="aayu-card text-[#55706C]">Loading documents…</div>}

      {!isLoading && documents.length === 0 && (
        <div className="aayu-card text-[#55706C]">
          No documents yet. Add a rejection letter, policy, bill, lab report, or prescription — Aayu reads each one into {patient?.name ?? "your"}&rsquo;s health record.
        </div>
      )}

      {documents.map((doc) => (
        <div key={doc.id} className="aayu-card flex items-center justify-between gap-3">
          <span className="min-w-0">
            <span className="block truncate font-medium text-[#123C3A]">{doc.filename}</span>
            <span className="text-sm text-[#55706C]">
              {KIND_LABELS[doc.kind] ?? doc.kind} · {new Date(doc.created_at).toLocaleDateString("en-IN")}
            </span>
          </span>
          <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-medium" style={statusStyle(doc.status)}>
            {statusLabel(doc.status)}
          </span>
        </div>
      ))}
    </section>
  );
}
