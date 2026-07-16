import { useHealthQuery, useSchemesQuery, type Patient } from "../../services/api";

const SCHEME_LABELS: Record<string, string> = {
  "PM-JAY": "Ayushman Bharat (PM-JAY)",
  "STATE-HEALTH-SCHEME": "State health scheme",
  "CM-RELIEF-FUND": "Chief Minister's Relief Fund",
};

function ScreenTitle({ children }: { children: string }) {
  return <h1 className="text-3xl font-medium text-[#042C53]">{children}</h1>;
}

export function HealthScreen({ patient }: { patient: Patient | null }) {
  const { data, isLoading, isError } = useHealthQuery(patient?.id ?? "", { skip: !patient?.id });
  const name = patient?.name ?? "your family";
  return (
    <section aria-labelledby="health-title" className="grid gap-4">
      <ScreenTitle>Health</ScreenTitle>
      {isLoading && <div className="aayu-card text-[#55706C]">Loading {name}&rsquo;s record…</div>}
      {(isError || (!isLoading && !data)) && (
        <div className="aayu-card text-[#55706C]">
          {name}&rsquo;s health record starts here. It fills in automatically from the documents you
          upload with your first claim.
        </div>
      )}
      {data && (
        <>
          <div className="aayu-card grid gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-[#8A8F8C]">Extracted from your documents</span>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-[#123C3A]">
              {data.data.summary || "No readable text was found in the uploaded documents."}
            </p>
          </div>
          {(data.data.amounts?.length ?? 0) > 0 && (
            <div className="aayu-card">
              <span className="text-xs font-medium uppercase tracking-wide text-[#8A8F8C]">Amounts detected</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.data.amounts!.map((amount, i) => (
                  <span key={i} className="rounded-full bg-[#E3F2ED] px-3 py-1 text-sm text-[#0F6E56]">
                    ₹{amount.toLocaleString("en-IN")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export function SchemesScreen({ patient }: { patient: Patient | null }) {
  const { data, isLoading, isError } = useSchemesQuery(patient?.id ?? "", { skip: !patient?.id });
  const name = patient?.name ?? "your family";
  const matches = data ?? [];
  return (
    <section aria-labelledby="schemes-title" className="grid gap-4">
      <ScreenTitle>Schemes</ScreenTitle>
      {isLoading && <div className="aayu-card text-[#55706C]">Checking eligibility…</div>}
      {(isError || (!isLoading && matches.length === 0)) && (
        <div className="aayu-card text-[#55706C]">
          No scheme matches yet. After your first claim we&rsquo;ll surface government benefits {name} may
          be owed.
        </div>
      )}
      {matches.map((scheme) => (
        <div key={scheme.scheme_code} className="aayu-card grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium text-[#123C3A]">{SCHEME_LABELS[scheme.scheme_code] ?? scheme.scheme_code}</span>
            <span
              className="rounded-full px-2.5 py-1 text-xs font-medium"
              style={
                scheme.matched
                  ? { background: "var(--aayu-success-bg)", color: "var(--aayu-teal-800)" }
                  : { background: "var(--aayu-surface-muted)", color: "var(--aayu-text-secondary)" }
              }
            >
              {scheme.matched ? "May be eligible" : "Worth checking"}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[#55706C]">{scheme.explanation}</p>
        </div>
      ))}
    </section>
  );
}
