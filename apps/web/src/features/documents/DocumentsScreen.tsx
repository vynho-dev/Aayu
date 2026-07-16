import { useState } from "react";

import { useCompleteUploadMutation, useDocumentsQuery, type Patient } from "../../services/api";
import { Icon } from "../app/Icon";
import { KIND_LABELS, statusLabel } from "./kinds";

function statusStyle(status: string): { background: string; color: string } {
  if (status === "completed") return { background: "var(--aayu-success-bg)", color: "var(--aayu-teal-800)" };
  if (status === "failed") return { background: "var(--aayu-danger-bg)", color: "var(--aayu-danger)" };
  return { background: "var(--aayu-surface-muted)", color: "var(--aayu-text-secondary)" };
}

export function DocumentsScreen({ patient, onBack, onAdd }: { patient: Patient | null; onBack: () => void; onAdd: () => void }) {
  const { data: documents = [], isLoading, isError, refetch } = useDocumentsQuery(patient?.id ?? "", {
    skip: !patient?.id,
    refetchOnMountOrArgChange: true,
  });
  const [completeUpload, completeState] = useCompleteUploadMutation();
  const [message, setMessage] = useState("");

  async function refreshWhileProcessing() {
    const result = await refetch();
    if (result.data?.some((doc) => ["uploaded", "processing"].includes(doc.status))) {
      window.setTimeout(() => { void refreshWhileProcessing(); }, 3000);
    }
  }

  async function processDocument(documentId: string) {
    setMessage("");
    try {
      await completeUpload(documentId).unwrap();
      void refreshWhileProcessing();
    } catch {
      setMessage("We couldn’t start processing this document. Please try again.");
    }
  }

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

      {isError && (
        <div className="aayu-card flex flex-wrap items-center justify-between gap-3 text-[#55706C]" role="alert">
          <span>We couldn&rsquo;t load the documents.</span>
          <button type="button" className="secondary-button" onClick={() => void refetch()}>Try again</button>
        </div>
      )}

      {message && <div className="aayu-card text-[#A23D32]" role="alert">{message}</div>}

      {!isLoading && !isError && documents.length === 0 && (
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
          <span className="flex shrink-0 items-center gap-2">
            <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={statusStyle(doc.status)}>
              {statusLabel(doc.status)}
            </span>
            {["uploaded", "failed"].includes(doc.status) && (
              <button type="button" className="secondary-button" disabled={completeState.isLoading} onClick={() => void processDocument(doc.id)}>
                {doc.status === "failed" ? "Retry" : "Process"}
              </button>
            )}
          </span>
        </div>
      ))}
    </section>
  );
}
