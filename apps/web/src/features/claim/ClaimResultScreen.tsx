import { useEffect, useState } from "react";

import { useClaimQuery, useDocumentsQuery, type Patient } from "../../services/api";
import { Icon } from "../app/Icon";

function useCountUp(target: number, durationMs = 800): number {
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const [value, setValue] = useState(() => (reduceMotion ? target : 0));
  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    let start: number | undefined;
    const tick = (ts: number) => {
      start ??= ts;
      const p = Math.min((ts - start) / durationMs, 1);
      setValue(Math.round(target * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, reduceMotion]);
  return reduceMotion ? target : value;
}

function downloadAppeal(name: string, text: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `aayu-appeal-${name.toLowerCase().replace(/\s+/g, "-")}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, background: "var(--aayu-surface-card)", border: "0.5px solid var(--aayu-border)", borderRadius: "var(--radius-md)", padding: "var(--space-4)" }}>
      <div className="aayu-text-body-sm" style={{ color: "var(--aayu-text-muted)" }}>{label}</div>
      <div className="aayu-text-h1" style={{ fontWeight: 500, color: "var(--aayu-ink-900)", marginTop: 4 }}>{value}</div>
    </div>
  );
}

function BackLink({ onBack }: { onBack: () => void }) {
  return (
    <button type="button" onClick={onBack} className="aayu-text-body-sm inline-flex items-center gap-1 font-medium text-(--aayu-teal-600)">
      ← Back to dashboard
    </button>
  );
}

interface JourneyStep {
  label: string;
  sub: string;
  done: boolean;
}

function JourneyStrip({ steps }: { steps: JourneyStep[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 0 }}>
      {steps.map((step, index) => (
        <div key={step.label} style={{ display: "flex", alignItems: "flex-start", flex: "1 1 140px", minWidth: 140 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: step.done ? "var(--aayu-teal-600)" : "transparent",
                  border: step.done ? "none" : "1.5px solid var(--aayu-border)",
                }}
              />
              <span className="aayu-text-caption" style={{ fontWeight: 500, color: step.done ? "var(--aayu-ink-900)" : "var(--aayu-text-secondary)" }}>{step.label}</span>
            </div>
            <span className="aayu-text-caption" style={{ color: "var(--aayu-text-muted)", marginLeft: 14 }}>{step.sub}</span>
          </div>
          {index < steps.length - 1 && (
            <div style={{ flex: 1, minWidth: 16, height: 1, background: "var(--aayu-border)", marginTop: 4, marginLeft: 6, marginRight: 6 }} />
          )}
        </div>
      ))}
    </div>
  );
}

function NextSteps() {
  const items = [
    "Download the appeal and send it to the insurer's Grievance Redressal Officer (email or branch), keeping the acknowledgement.",
    "The insurer must respond to a grievance — typically within 15 days.",
    <>
      If it&rsquo;s rejected again or ignored, escalate free of charge to Bima Bharosa / the IRDAI Insurance Ombudsman —{" "}
      <a href="https://irdai.gov.in/ombudsman" target="_blank" rel="noreferrer" style={{ color: "var(--aayu-teal-600)", fontWeight: 500 }}>
        irdai.gov.in/ombudsman
      </a>
      .
    </>,
  ];
  return (
    <section style={{ background: "var(--aayu-surface-card)", border: "0.5px solid var(--aayu-border)", borderRadius: "var(--radius-md)", padding: "var(--space-5)" }}>
      <h2 className="aayu-text-h2" style={{ fontWeight: 500, color: "var(--aayu-ink-900)", marginBottom: 10 }}>What happens next</h2>
      <ol style={{ display: "flex", flexDirection: "column", gap: 10, listStyle: "none", margin: 0, padding: 0 }}>
        {items.map((item, index) => (
          <li key={index} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span
              className="aayu-text-caption"
              style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: "var(--aayu-surface-muted)", color: "var(--aayu-text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 500 }}
            >
              {index + 1}
            </span>
            <span className="aayu-text-body-sm" style={{ color: "var(--aayu-text-secondary)" }}>{item}</span>
          </li>
        ))}
      </ol>
      <p className="aayu-text-caption" style={{ color: "var(--aayu-text-muted)", marginTop: 12 }}>
        Aayu helps you prepare and track your appeal — it isn&rsquo;t legal or regulated insurance advice.
      </p>
    </section>
  );
}

export function ClaimResultScreen({ patient, onViewHealth, onBack, onNewClaim, onAddEvidence }: { patient: Patient | null; onViewHealth: () => void; onBack: () => void; onNewClaim: () => void; onAddEvidence: () => void }) {
  const name = patient?.name ?? "the patient";
  const { data: claim, isLoading, isError } = useClaimQuery(patient?.id ?? "", { skip: !patient?.id });
  const { data: documents = [] } = useDocumentsQuery(patient?.id ?? "", { skip: !patient?.id });
  const assessment = claim?.assessment ?? null;
  const amount = useCountUp(assessment?.recoverable_amount ?? 0);
  // Derive from the server text; local edits override it. No effect-sync needed.
  const [edited, setEdited] = useState<string | null>(null);
  const letter = edited ?? claim?.appeal_text ?? "";
  const missingEvidence = [
    ["policy", "Insurance policy"], ["discharge_summary", "Discharge summary"], ["bill", "Hospital bill"], ["prescription", "Prescription"],
  ].filter(([kind]) => !documents.some((document) => document.kind === kind));

  if (isLoading) {
    return (
      <div className="grid gap-5">
        <BackLink onBack={onBack} />
        <section className="aayu-card" aria-live="polite">
          <h1 className="aayu-text-h1 font-medium text-(--aayu-ink-900)">Preparing your assessment…</h1>
        </section>
      </div>
    );
  }

  if (isError || !claim || !assessment) {
    return (
      <div className="grid gap-5">
        <BackLink onBack={onBack} />
        <section className="aayu-card" aria-live="polite">
          <h1 className="aayu-text-h1 mb-2 font-medium text-(--aayu-ink-900)">No assessment yet</h1>
          <p className="aayu-text-body-sm text-(--aayu-text-secondary)">We couldn&rsquo;t read a claim from the uploaded documents. Try uploading the rejection letter again.</p>
          <button type="button" className="primary-button mt-4" onClick={onNewClaim}>Upload a rejection letter</button>
        </section>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <BackLink onBack={onBack} />

      {assessment.source !== "llm" && (
        <div
          className="aayu-text-caption"
          style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "var(--radius-pill)", background: "var(--aayu-attention-bg)", color: "var(--aayu-attention)", fontWeight: 500 }}
        >
          Preliminary assessment · review the uploaded document before sending an appeal
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="shield" size={14} color="var(--aayu-teal-600)" />
        <span className="aayu-text-caption" style={{ color: "var(--aayu-text-muted)" }}>Encrypted · {name}&rsquo;s claim</span>
      </div>

      <JourneyStrip
        steps={[
          { label: "Documents received", sub: `${documents.length} on file`, done: documents.length > 0 },
          { label: "AI analysis", sub: assessment ? "Complete" : "Pending", done: Boolean(assessment) },
          { label: "Appeal drafted", sub: claim.appeal_text ? "Ready to send" : "Pending", done: Boolean(claim.appeal_text) },
          { label: "Send to insurer", sub: "Your next step", done: false },
        ]}
      />

      <div>
        <span className="aayu-text-caption" style={{ display: "inline-flex", padding: "4px 10px", borderRadius: "var(--radius-pill)", background: assessment.contestable ? "var(--aayu-attention-bg)" : "var(--aayu-surface-muted)", color: assessment.contestable ? "var(--aayu-attention)" : "var(--aayu-text-secondary)", fontWeight: 500 }}>
          {assessment.contestable ? "Contestable denial" : "Review needed"}
        </span>
        <div className="aayu-text-stat" style={{ fontWeight: 500, color: "var(--aayu-teal-600)", marginTop: 10 }}>
          ₹{amount.toLocaleString("en-IN")} recoverable
        </div>
        <div className="aayu-text-body-sm" style={{ color: "var(--aayu-text-secondary)", marginTop: 4 }}>Based on the documents you uploaded.</div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Metric label="Documents read" value={String(assessment.documents_read)} />
        <Metric label="Clause cited" value={assessment.clause || "—"} />
      </div>

      <section style={{ background: "var(--aayu-surface-card)", border: "0.5px solid var(--aayu-border)", borderRadius: "var(--radius-md)", padding: "var(--space-5)" }}>
        <h2 className="aayu-text-h2" style={{ fontWeight: 500, color: "var(--aayu-ink-900)", marginBottom: 8 }}>Likely reason for denial</h2>
        <p className="aayu-text-body-sm" style={{ color: "var(--aayu-text-secondary)" }}>{assessment.reason}</p>
      </section>

      <section className="aayu-card grid gap-3">
        <div>
          <h2 className="aayu-text-h2" style={{ fontWeight: 500, color: "var(--aayu-ink-900)" }}>Evidence checklist</h2>
          <p className="aayu-text-body-sm" style={{ color: "var(--aayu-text-secondary)", marginTop: 4 }}>{missingEvidence.length ? "These documents can strengthen the appeal and explain the treatment." : "The core supporting evidence is in this patient’s record."}</p>
        </div>
        {missingEvidence.length > 0 && <div className="flex flex-wrap gap-2">{missingEvidence.map(([, label]) => <span key={label} className="rounded-full bg-[#FFF4E5] px-3 py-1 text-sm text-[#8A5A00]">Missing: {label}</span>)}</div>}
        <button type="button" className="secondary-button w-fit" onClick={onAddEvidence}>{missingEvidence.length ? "Add supporting evidence" : "View documents"}</button>
      </section>

      <section style={{ background: "var(--aayu-surface-card)", border: "0.5px solid var(--aayu-border)", borderRadius: "var(--radius-md)", padding: "var(--space-5)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 10 }}>
          <h2 className="aayu-text-h2" style={{ fontWeight: 500, color: "var(--aayu-ink-900)" }}>Appeal letter</h2>
          <span className="aayu-text-caption" style={{ color: "var(--aayu-attention)", fontWeight: 500 }}>Review before sending</span>
        </div>
        <textarea
          value={letter}
          onChange={(event) => setEdited(event.target.value)}
          aria-label="Appeal letter"
          rows={9}
          className="aayu-text-body-sm"
          style={{ width: "100%", resize: "vertical", border: "0.5px solid var(--aayu-border)", borderRadius: "var(--radius-sm)", padding: 12, fontFamily: "var(--font-sans)", color: "var(--aayu-text-primary)", background: "var(--aayu-surface-page)" }}
        />
        <button className="primary-button mt-3" onClick={() => downloadAppeal(name, letter)} disabled={!letter}>Download appeal letter</button>
      </section>

      <NextSteps />

      <button type="button" onClick={onViewHealth} className="aayu-card text-left" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon name="health" size={20} color="var(--aayu-teal-600)" />
        <span>
          <span className="aayu-text-h2 block" style={{ fontWeight: 500, color: "var(--aayu-text-primary)" }}>View {name}&rsquo;s health record</span>
          <span className="aayu-text-body-sm" style={{ color: "var(--aayu-text-secondary)" }}>These documents also started {name}&rsquo;s Vault.</span>
        </span>
      </button>
    </div>
  );
}
