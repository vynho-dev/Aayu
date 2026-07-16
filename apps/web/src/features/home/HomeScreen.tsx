import { useClaimQuery, useDocumentsQuery, useHealthQuery, useSchemesQuery, type Patient } from "../../services/api";
import { Icon, type IconName } from "../app/Icon";
import type { Tab } from "../app/AppShell";
import { KIND_LABELS, statusLabel } from "../documents/kinds";

function SectionLabel({ children }: { children: string }) {
  return (
    <div
      className="aayu-text-label"
      style={{
        fontWeight: 500,
        letterSpacing: "0.04em",
        color: "var(--aayu-text-muted)",
        textTransform: "uppercase",
        margin: "4px 0 10px",
      }}
    >
      {children}
    </div>
  );
}

function QuickTile({ icon, title, value, sub, onClick }: { icon: IconName; title: string; value: string; sub: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: 0,
        textAlign: "left",
        background: "var(--aayu-surface-card)",
        border: "0.5px solid var(--aayu-border)",
        borderRadius: "var(--radius-md)",
        padding: "var(--space-4)",
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <Icon name={icon} size={22} color="var(--aayu-teal-600)" />
      <div className="aayu-text-h1" style={{ fontWeight: 500, color: "var(--aayu-ink-900)" }}>{value}</div>
      <div className="aayu-text-body-sm" style={{ color: "var(--aayu-text-secondary)" }}>{title}</div>
      <div className="aayu-text-label" style={{ color: "var(--aayu-text-muted)" }}>{sub}</div>
    </button>
  );
}

export function HomeScreen({ patient, onNewClaim, onViewClaim, onAskPolicy, onViewDocuments, onNav }: { patient: Patient | null; onNewClaim: () => void; onViewClaim: () => void; onAskPolicy: () => void; onViewDocuments: () => void; onNav: (id: Tab) => void }) {
  const name = patient?.name ?? "your family";
  const { data: health, isError: healthError, refetch: refetchHealth } = useHealthQuery(patient?.id ?? "", { skip: !patient?.id });
  const { data: schemes, isError: schemesError, refetch: refetchSchemes } = useSchemesQuery(patient?.id ?? "", { skip: !patient?.id });
  const { data: claim } = useClaimQuery(patient?.id ?? "", { skip: !patient?.id });
  const { data: documents = [], isError: documentsError, refetch: refetchDocuments } = useDocumentsQuery(patient?.id ?? "", { skip: !patient?.id });
  const matchedCount = schemes?.filter((s) => s.matched).length ?? 0;
  const healthReady = (health?.data.documents?.length ?? 0) > 0;
  const hasClaim = Boolean(claim?.assessment);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header: greeting + patient chip */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div className="aayu-text-display" style={{ fontWeight: 500, color: "var(--aayu-text-primary)" }}>Hi there</div>
          <div className="aayu-text-body-sm" style={{ color: "var(--aayu-text-secondary)", marginTop: 2 }}>Here&rsquo;s where {name}&rsquo;s care stands.</div>
        </div>
        <button
          onClick={() => onNav("profile")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            border: "0.5px solid var(--aayu-border)",
            background: "var(--aayu-surface-card)",
            borderRadius: "var(--radius-pill)",
            padding: "6px 10px 6px 6px",
            fontFamily: "var(--font-sans)",
            flexShrink: 0,
          }}
        >
          <span
            className="aayu-text-caption"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--aayu-teal-100)",
              color: "var(--aayu-teal-900)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 500,
            }}
          >
            {(patient?.name ?? "?").charAt(0).toUpperCase()}
          </span>
          <span className="aayu-text-body-sm" style={{ fontWeight: 500, color: "var(--aayu-text-primary)" }}>{patient?.name ?? "Patient"}</span>
          <Icon name="chevron" size={16} color="var(--aayu-text-muted)" />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr] md:gap-5">
        {/* Primary: start your first claim */}
        <section
          style={{
            background: "var(--aayu-success-bg)",
            border: "0.5px solid var(--aayu-teal-100)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-5)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div className="aayu-text-h2" style={{ fontWeight: 500, color: "var(--aayu-teal-800)" }}>{hasClaim ? "Your claim assessment is ready" : "Start a claim"}</div>
          <div className="aayu-text-body-sm" style={{ color: "var(--aayu-text-secondary)" }}>
            {hasClaim
              ? `Aayu found ₹${(claim?.assessment?.recoverable_amount ?? 0).toLocaleString("en-IN")} potentially recoverable. Review the assessment and appeal draft before sending.`
              : "Upload a rejection letter and we&rsquo;ll read it, find the clause the insurer missed, and draft a clause-cited appeal."}
          </div>
          <button
            onClick={hasClaim ? onViewClaim : onNewClaim}
            className="primary-button"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, alignSelf: "flex-start", padding: "12px 18px" }}
          >
            <Icon name={hasClaim ? "claim" : "plus"} size={18} color="#fff" /> {hasClaim ? "View assessment" : "Fight a claim"}
          </button>
        </section>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <SectionLabel>Quick access</SectionLabel>
            <div style={{ display: "flex", gap: 12 }}>
              <QuickTile icon="health" value={healthReady ? "Ready" : "—"} title="Health record" sub={healthReady ? "Extracted" : "Nothing yet"} onClick={() => onNav("health")} />
              <QuickTile icon="schemes" value={matchedCount > 0 ? String(matchedCount) : "—"} title="Scheme matches" sub={matchedCount > 0 ? "May be eligible" : "No match yet"} onClick={() => onNav("schemes")} />
            </div>
          </div>
          <button
            type="button"
            onClick={onAskPolicy}
            className="aayu-card text-left"
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <Icon name="chat" size={22} color="var(--aayu-teal-600)" />
            <span>
              <span className="aayu-text-body-sm block" style={{ fontWeight: 500, color: "var(--aayu-text-primary)" }}>Ask about my policy</span>
              <span className="aayu-text-body-sm" style={{ color: "var(--aayu-text-secondary)" }}>Plain-language answers from your uploaded policy.</span>
            </span>
          </button>
          <button
            type="button"
            onClick={onViewDocuments}
            className="aayu-card text-left"
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <Icon name="claim" size={22} color="var(--aayu-teal-600)" />
            <span>
              <span className="aayu-text-body-sm block" style={{ fontWeight: 500, color: "var(--aayu-text-primary)" }}>Documents</span>
              <span className="aayu-text-body-sm" style={{ color: "var(--aayu-text-secondary)" }}>Add bills, labs, prescriptions — all in one place.</span>
            </span>
          </button>
          <div>
            <SectionLabel>Recent activity</SectionLabel>
            <div
              style={{
                border: "0.5px solid var(--aayu-border)",
                borderRadius: "var(--radius-md)",
                background: "var(--aayu-surface-card)",
                padding: "var(--space-5)",
              }}
            >
              {documents.length === 0 ? (
                <div className="aayu-text-body-sm" style={{ color: "var(--aayu-text-muted)" }}>No activity yet. Add a document to begin this patient&rsquo;s record.</div>
              ) : (
                <div className="grid gap-2">
                  {documents.slice(0, 3).map((document) => (
                    <button type="button" key={document.id} onClick={onViewDocuments} className="aayu-text-body-sm text-left text-(--aayu-text-secondary)">
                      {KIND_LABELS[document.kind] ?? document.kind} · {document.filename} · {statusLabel(document.status)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {(healthError || schemesError || documentsError) && (
        <div className="aayu-card flex flex-wrap items-center justify-between gap-3" role="alert">
          <span className="aayu-text-body-sm text-(--aayu-text-secondary)">We couldn&rsquo;t refresh all of {name}&rsquo;s information.</span>
          <button type="button" className="secondary-button" onClick={() => { void refetchHealth(); void refetchSchemes(); void refetchDocuments(); }}>Try again</button>
        </div>
      )}

      <div
        className="aayu-text-body-sm"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          alignSelf: "flex-start",
          padding: "8px 14px",
          borderRadius: "var(--radius-pill)",
          background: "var(--aayu-success-bg)",
          color: "var(--aayu-teal-900)",
          fontWeight: 500,
        }}
      >
        <Icon name="shield" size={16} color="var(--aayu-teal-600)" />
        Your data is encrypted · Pay only if we win
      </div>
    </div>
  );
}
