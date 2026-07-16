import { useEffect, useState } from "react";

import { useClaimQuery, type Patient } from "../../services/api";
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
      <div style={{ fontSize: 13, color: "var(--aayu-text-muted)" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: "var(--aayu-ink-900)", marginTop: 4 }}>{value}</div>
    </div>
  );
}

function BackLink({ onBack }: { onBack: () => void }) {
  return (
    <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-medium text-[#0F6E56]">
      ← Back to dashboard
    </button>
  );
}

export function ClaimResultScreen({ patient, onViewHealth, onBack }: { patient: Patient | null; onViewHealth: () => void; onBack: () => void }) {
  const name = patient?.name ?? "the patient";
  const { data: claim, isLoading, isError } = useClaimQuery(patient?.id ?? "", { skip: !patient?.id });
  const assessment = claim?.assessment ?? null;
  const amount = useCountUp(assessment?.recoverable_amount ?? 0);
  // Derive from the server text; local edits override it. No effect-sync needed.
  const [edited, setEdited] = useState<string | null>(null);
  const letter = edited ?? claim?.appeal_text ?? "";

  if (isLoading) {
    return (
      <div className="grid gap-5">
        <BackLink onBack={onBack} />
        <section className="aayu-card" aria-live="polite">
          <h1 className="text-2xl font-medium text-[#042C53]">Preparing your assessment…</h1>
        </section>
      </div>
    );
  }

  if (isError || !claim || !assessment) {
    return (
      <div className="grid gap-5">
        <BackLink onBack={onBack} />
        <section className="aayu-card" aria-live="polite">
          <h1 className="mb-2 text-2xl font-medium text-[#042C53]">No assessment yet</h1>
          <p className="text-[#55706C]">We couldn&rsquo;t read a claim from the uploaded documents. Try uploading the rejection letter again.</p>
        </section>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <BackLink onBack={onBack} />

      {assessment.source !== "llm" && (
        <div
          style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: "var(--radius-pill)", background: "var(--aayu-attention-bg)", color: "var(--aayu-attention)", fontSize: 12, fontWeight: 500 }}
        >
          Preliminary assessment · deeper AI analysis available with an API key
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="shield" size={14} color="var(--aayu-teal-600)" />
        <span style={{ fontSize: 12, color: "var(--aayu-text-muted)" }}>Encrypted · {name}&rsquo;s claim</span>
      </div>

      <div>
        <span style={{ display: "inline-flex", padding: "4px 10px", borderRadius: "var(--radius-pill)", background: assessment.contestable ? "var(--aayu-attention-bg)" : "var(--aayu-surface-muted)", color: assessment.contestable ? "var(--aayu-attention)" : "var(--aayu-text-secondary)", fontSize: 12, fontWeight: 500 }}>
          {assessment.contestable ? "Contestable denial" : "Review needed"}
        </span>
        <div style={{ fontSize: 30, fontWeight: 500, color: "var(--aayu-teal-600)", marginTop: 10 }}>
          ₹{amount.toLocaleString("en-IN")} recoverable
        </div>
        <div style={{ fontSize: 14, color: "var(--aayu-text-secondary)", marginTop: 4 }}>Based on the documents you uploaded.</div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <Metric label="Documents read" value={String(assessment.documents_read)} />
        <Metric label="Clause cited" value={assessment.clause || "—"} />
      </div>

      <section style={{ background: "var(--aayu-surface-card)", border: "0.5px solid var(--aayu-border)", borderRadius: "var(--radius-md)", padding: "var(--space-5)" }}>
        <h2 style={{ fontSize: 16, fontWeight: 500, color: "var(--aayu-ink-900)", marginBottom: 8 }}>Likely reason for denial</h2>
        <p style={{ fontSize: 14, color: "var(--aayu-text-secondary)", lineHeight: 1.6 }}>{assessment.reason}</p>
      </section>

      <section style={{ background: "var(--aayu-surface-card)", border: "0.5px solid var(--aayu-border)", borderRadius: "var(--radius-md)", padding: "var(--space-5)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 10 }}>
          <h2 style={{ fontSize: 16, fontWeight: 500, color: "var(--aayu-ink-900)" }}>Appeal letter</h2>
          <span style={{ fontSize: 12, color: "var(--aayu-attention)", fontWeight: 500 }}>Review before sending</span>
        </div>
        <textarea
          value={letter}
          onChange={(event) => setEdited(event.target.value)}
          aria-label="Appeal letter"
          rows={9}
          style={{ width: "100%", resize: "vertical", border: "0.5px solid var(--aayu-border)", borderRadius: "var(--radius-sm)", padding: 12, fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.6, color: "var(--aayu-text-primary)", background: "var(--aayu-surface-page)" }}
        />
        <button className="primary-button mt-3" onClick={() => downloadAppeal(name, letter)} disabled={!letter}>Download appeal letter</button>
      </section>

      <button type="button" onClick={onViewHealth} className="aayu-card text-left" style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Icon name="health" size={20} color="var(--aayu-teal-600)" />
        <span>
          <span className="block font-medium text-[#123C3A]">View {name}&rsquo;s health record</span>
          <span className="text-sm text-[#55706C]">These documents also started {name}&rsquo;s Vault.</span>
        </span>
      </button>
    </div>
  );
}
