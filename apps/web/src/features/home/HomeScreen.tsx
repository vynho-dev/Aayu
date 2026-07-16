import { useHealthQuery, useSchemesQuery, type Patient } from "../../services/api";
import { Icon, type IconName } from "../app/Icon";
import type { Tab } from "../app/AppShell";

function SectionLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: 12,
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
      <div style={{ fontSize: 22, fontWeight: 500, color: "var(--aayu-ink-900)" }}>{value}</div>
      <div style={{ fontSize: 13, color: "var(--aayu-text-secondary)" }}>{title}</div>
      <div style={{ fontSize: 12, color: "var(--aayu-text-muted)" }}>{sub}</div>
    </button>
  );
}

export function HomeScreen({ patient, onNewClaim, onAskPolicy, onViewDocuments, onNav }: { patient: Patient | null; onNewClaim: () => void; onAskPolicy: () => void; onViewDocuments: () => void; onNav: (id: Tab) => void }) {
  const name = patient?.name ?? "your family";
  const { data: health } = useHealthQuery(patient?.id ?? "", { skip: !patient?.id });
  const { data: schemes } = useSchemesQuery(patient?.id ?? "", { skip: !patient?.id });
  const matchedCount = schemes?.filter((s) => s.matched).length ?? 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header: greeting + patient chip */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 500, color: "var(--aayu-text-primary)" }}>Hi there</div>
          <div style={{ fontSize: 13, color: "var(--aayu-text-secondary)", marginTop: 2 }}>Here&rsquo;s where {name}&rsquo;s care stands.</div>
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
              fontSize: 12,
            }}
          >
            {(patient?.name ?? "?").charAt(0).toUpperCase()}
          </span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--aayu-text-primary)" }}>{patient?.name ?? "Patient"}</span>
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
          <div style={{ fontSize: 18, fontWeight: 500, color: "var(--aayu-teal-800)" }}>Start your first claim</div>
          <div style={{ fontSize: 14, color: "var(--aayu-text-secondary)", lineHeight: 1.6 }}>
            Upload a rejection letter and we&rsquo;ll read it, find the clause the insurer missed, and draft a
            clause-cited appeal. You pay only if we win.
          </div>
          <button
            onClick={onNewClaim}
            className="primary-button"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, alignSelf: "flex-start", padding: "12px 18px" }}
          >
            <Icon name="plus" size={18} color="#fff" /> Fight a claim
          </button>
        </section>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <SectionLabel>Quick access</SectionLabel>
            <div style={{ display: "flex", gap: 12 }}>
              <QuickTile icon="health" value={health ? "Ready" : "—"} title="Health record" sub={health ? "Extracted" : "Nothing yet"} onClick={() => onNav("health")} />
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
              <span className="block font-medium text-[#123C3A]">Ask about my policy</span>
              <span className="text-sm text-[#55706C]">Plain-language answers from your uploaded policy.</span>
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
              <span className="block font-medium text-[#123C3A]">Documents</span>
              <span className="text-sm text-[#55706C]">Add bills, labs, prescriptions — all in one place.</span>
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
              <div style={{ fontSize: 14, color: "var(--aayu-text-muted)", lineHeight: 1.6 }}>
                Nothing yet. Your appeal, health records, and scheme matches will appear here after your first claim.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          alignSelf: "flex-start",
          padding: "8px 14px",
          borderRadius: "var(--radius-pill)",
          background: "var(--aayu-success-bg)",
          color: "var(--aayu-teal-900)",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        <Icon name="shield" size={16} color="var(--aayu-teal-600)" />
        Your data is encrypted · Pay only if we win
      </div>
    </div>
  );
}
