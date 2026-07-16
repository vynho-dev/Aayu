import { type ReactNode, useState } from "react";

import { useAskPolicyMutation, usePolicyDocumentQuery, type Patient } from "../../services/api";
import { Icon } from "../app/Icon";

type Message = { from: "user" | "ai" | "error"; text: string; excerpts?: string[] };

/** Renders the LLM's prose (bold, bullet/numbered lists, paragraphs) without a markdown dependency. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={`${keyPrefix}-${i}`}>{part}</strong> : part
  );
}

function renderMarkdownLite(text: string): ReactNode {
  return text.trim().split(/\n\s*\n/).map((block, i) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length > 0 && lines.every((line) => /^[-*]\s/.test(line))) {
      return (
        <ul key={i} style={{ margin: i === 0 ? 0 : "8px 0 0", paddingLeft: 20 }}>
          {lines.map((line, j) => <li key={j}>{renderInline(line.replace(/^[-*]\s/, ""), `${i}-${j}`)}</li>)}
        </ul>
      );
    }
    if (lines.length > 0 && lines.every((line) => /^\d+\.\s/.test(line))) {
      return (
        <ol key={i} style={{ margin: i === 0 ? 0 : "8px 0 0", paddingLeft: 20 }}>
          {lines.map((line, j) => <li key={j}>{renderInline(line.replace(/^\d+\.\s/, ""), `${i}-${j}`)}</li>)}
        </ol>
      );
    }
    return (
      <p key={i} style={{ margin: i === 0 ? 0 : "8px 0 0", whiteSpace: "pre-wrap" }}>
        {renderInline(block, `${i}`)}
      </p>
    );
  });
}

export function PolicyQAScreen({ patient, onBack, onNeedPolicy }: { patient: Patient | null; onBack: () => void; onNeedPolicy: () => void }) {
  const { data: policy, isLoading, isError } = usePolicyDocumentQuery(patient?.id ?? "", { skip: !patient?.id });
  const [ask, askState] = useAskPolicyMutation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");

  async function send() {
    const question = draft.trim();
    if (!question || !patient || !policy || askState.isLoading) return;
    setDraft("");
    setMessages((prev) => [...prev, { from: "user", text: question }]);
    try {
      const result = await ask({ patientId: patient.id, documentId: policy.document_id, question }).unwrap();
      setMessages((prev) => [...prev, { from: "ai", text: result.answer, excerpts: result.excerpts }]);
    } catch {
      setMessages((prev) => [...prev, { from: "error", text: "We couldn't answer that just now. Please try again." }]);
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col">
      <button type="button" onClick={onBack} className="mb-4 inline-flex w-fit items-center gap-1 text-sm font-medium text-[#0F6E56]">
        ← Back to dashboard
      </button>
      <h1 className="mb-4 flex items-center gap-2 text-2xl font-medium text-[#042C53]">
        <Icon name="chat" size={22} color="var(--aayu-teal-600)" /> Explain my policy
      </h1>

      {isLoading && <div className="aayu-card text-[#55706C]">Loading your policy…</div>}

      {isError && (
        <div className="aayu-card grid gap-3 text-[#55706C]">
          <p>Upload your policy document first, then ask anything about it in plain language.</p>
          <button type="button" onClick={onNeedPolicy} className="primary-button w-fit">Upload a policy</button>
        </div>
      )}

      {policy && (
        <>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4" aria-live="polite">
            {messages.length === 0 && (
              <div className="aayu-card text-sm text-[#55706C]">
                Ask anything about {patient?.name ?? "your"}&rsquo;s policy — for example, &ldquo;Is a second surgery covered this year?&rdquo; Answers come only from your uploaded policy.
              </div>
            )}
            {messages.map((message, i) => (
              <div
                key={i}
                style={{
                  alignSelf: message.from === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  background: message.from === "user" ? "var(--aayu-teal-600)" : "var(--aayu-surface-card)",
                  color: message.from === "user" ? "#fff" : message.from === "error" ? "var(--aayu-danger)" : "var(--aayu-text-primary)",
                  border: message.from === "user" ? "none" : "0.5px solid var(--aayu-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "10px 14px",
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                <div>{renderMarkdownLite(message.text)}</div>
                {message.excerpts && message.excerpts.length > 0 && (
                  <details className="mt-2 text-xs text-[#55706C]">
                    <summary className="cursor-pointer">From your policy</summary>
                    {message.excerpts.map((excerpt, j) => (
                      <div key={j} className="mt-1 border-l-2 border-[#E4E2DA] pl-2 italic">{renderMarkdownLite(excerpt)}</div>
                    ))}
                  </details>
                )}
              </div>
            ))}
            {askState.isLoading && (
              <div style={{ alignSelf: "flex-start", background: "var(--aayu-surface-card)", border: "0.5px solid var(--aayu-border)", borderRadius: "var(--radius-md)", padding: "10px 14px", fontSize: 15, color: "var(--aayu-text-muted)" }}>
                Reading your policy…
              </div>
            )}
          </div>

          <form
            className="sticky bottom-0 flex gap-2 border-t border-[#E4E2DA] bg-[#F7F6F2] py-3"
            onSubmit={(event) => { event.preventDefault(); void send(); }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask anything about your policy"
              aria-label="Ask about your policy"
              className="flex-1"
              style={{ minHeight: 44 }}
            />
            <button type="submit" className="primary-button" disabled={!draft.trim() || askState.isLoading}>Ask</button>
          </form>
        </>
      )}
    </div>
  );
}
