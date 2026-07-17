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

interface SetupItem {
  label: string;
  done: boolean;
  onClick: () => void;
}

function SetupChecklist({ items }: { items: SetupItem[] }) {
  const doneCount = items.filter((item) => item.done).length;
  if (doneCount === items.length) return null;
  return (
    <div className="aayu-card" style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="aayu-text-body-sm" style={{ fontWeight: 500, color: "var(--aayu-text-primary)" }}>Getting set up</span>
        <span className="aayu-text-label" style={{ color: "var(--aayu-text-muted)" }}>{doneCount} of {items.length} done</span>
      </div>
      {items.map((item) =>
        item.done ? (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "var(--aayu-teal-600)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            <span className="aayu-text-body-sm" style={{ color: "var(--aayu-text-muted)" }}>{item.label}</span>
          </div>
        ) : (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: "var(--font-sans)",
              textAlign: "left",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "1.5px solid var(--aayu-border)",
                  flexShrink: 0,
                }}
              />
              <span className="aayu-text-body-sm" style={{ color: "var(--aayu-text-primary)" }}>{item.label}</span>
            </span>
            <Icon name="chevron" size={16} color="var(--aayu-text-muted)" />
          </button>
        )
      )}
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
  const profile = patient?.profile;
  const profileSignals = [profile?.state, profile?.insurance_status, profile?.insurance_provider, profile?.emergency_contact_name, profile?.preferred_hospital, profile?.abha_number, ...(profile?.chronic_conditions ?? []), ...(profile?.medications ?? [])].filter(Boolean).length;
  const profileReady = profileSignals >= 3;
  const nextAction = !profileReady
    ? { title: "Complete the care profile", body: "Add insurance, medical history, emergency contact, and care preferences so every claim starts with the right facts.", label: "Complete profile", onClick: () => onNav("profile"), icon: "profile" as IconName }
    : hasClaim
      ? { title: "Your claim assessment is ready", body: `Aayu found ₹${(claim?.assessment?.recoverable_amount ?? 0).toLocaleString("en-IN")} potentially recoverable. Review the assessment and appeal draft before sending.`, label: "View assessment", onClick: onViewClaim, icon: "claim" as IconName }
      : { title: "Start a claim", body: "Upload a rejection letter and we’ll explain the denial, identify missing evidence, and draft the next step.", label: "Fight a claim", onClick: onNewClaim, icon: "plus" as IconName };
  const setupItems: SetupItem[] = [
    { label: `Add ${name}'s care details`, done: profileReady, onClick: () => onNav("profile") },
    { label: "Upload a first document", done: documents.length > 0, onClick: onViewDocuments },
    { label: "Start a claim from a rejection letter", done: hasClaim, onClick: onNewClaim },
    { label: "Check government scheme eligibility", done: Boolean(schemes && schemes.length > 0), onClick: () => onNav("schemes") },
  ];
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

      {patient && <SetupChecklist items={setupItems} />}

      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr] md:gap-5">
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
          <div className="aayu-text-h2" style={{ fontWeight: 500, color: "var(--aayu-teal-800)" }}>{nextAction.title}</div>
          <div className="aayu-text-body-sm" style={{ color: "var(--aayu-text-secondary)" }}>{nextAction.body}</div>
          <button
            onClick={nextAction.onClick}
            className="primary-button"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, alignSelf: "flex-start", padding: "12px 18px" }}
          >
            <Icon name={nextAction.icon} size={18} color="#fff" /> {nextAction.label}
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
          <button type="button" onClick={() => onNav("profile")} className="aayu-card text-left" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon name="profile" size={22} color="var(--aayu-teal-600)" />
            <span><span className="aayu-text-body-sm block" style={{ fontWeight: 500, color: "var(--aayu-text-primary)" }}>Care profile {profileReady ? "ready" : "needs attention"}</span><span className="aayu-text-body-sm" style={{ color: "var(--aayu-text-secondary)" }}>{profileReady ? "Insurance, emergency, and care details are saved." : "Add the details that make claims and care safer."}</span></span>
          </button>
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
