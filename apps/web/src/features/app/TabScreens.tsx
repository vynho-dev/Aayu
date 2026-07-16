import { type FormEvent, useState } from "react";

import {
  useHealthQuery,
  useLazyEligibilityMatchesQuery,
  useSaveEligibilityProfileMutation,
  type EmploymentType,
  type Patient,
} from "../../services/api";
import { KIND_LABELS } from "../documents/kinds";

const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  government_employee_or_pensioner: "Government employee or pensioner",
  organized_sector_employee: "Organized-sector employee",
  unorganized_sector_or_self_employed: "Unorganized sector / self-employed",
  farmer: "Farmer",
  unemployed: "Unemployed",
};

function ScreenTitle({ children }: { children: string }) {
  return <h1 className="text-3xl font-medium text-[#042C53]">{children}</h1>;
}

function ChipCard({ label, items }: { label: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="aayu-card">
      <span className="text-xs font-medium uppercase tracking-wide text-[#8A8F8C]">{label}</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className="rounded-full bg-[#E3F2ED] px-3 py-1 text-sm text-[#0F6E56]">{item}</span>
        ))}
      </div>
    </div>
  );
}

export function HealthScreen({ patient, onViewDocuments }: { patient: Patient | null; onViewDocuments: () => void }) {
  const { data, isLoading, isError, refetch } = useHealthQuery(patient?.id ?? "", { skip: !patient?.id });
  const name = patient?.name ?? "your family";
  const record = data?.data;
  const amountChips = record?.amounts?.map((amount) => `₹${amount.toLocaleString("en-IN")}`);
  const documents = record?.documents ?? [];
  const hasHealthData = Boolean(record && (record.summary || record.conditions?.length || record.medications?.length || record.lab_findings?.length || record.procedures?.length || record.tests?.length || record.follow_up || documents.length));

  return (
    <section aria-labelledby="health-title" className="grid gap-4">
      <ScreenTitle>Health</ScreenTitle>
      {isLoading && <div className="aayu-card text-[#55706C]">Loading {name}&rsquo;s record…</div>}
      {isError && (
        <div className="aayu-card flex flex-wrap items-center justify-between gap-3 text-[#55706C]" role="alert">
          <span>We couldn&rsquo;t load {name}&rsquo;s health record.</span>
          <button type="button" className="secondary-button" onClick={() => void refetch()}>Try again</button>
        </div>
      )}
      {!isLoading && !isError && !hasHealthData && (
        <div className="aayu-card grid gap-3 text-[#55706C]">
          <p>{name}&rsquo;s health record starts here. It fills in automatically from the documents you upload — claims, discharge summaries, lab reports, and prescriptions.</p>
          <button type="button" onClick={onViewDocuments} className="primary-button w-fit">Add a document</button>
        </div>
      )}
      {record && hasHealthData && (
        <>
          {record.summary && (
            <div className="aayu-card grid gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-[#8A8F8C]">Summary</span>
              <p className="mt-1 text-sm leading-relaxed text-[#123C3A]">{record.summary}</p>
            </div>
          )}
          <ChipCard label="Conditions" items={record.conditions} />
          <ChipCard label="Medications" items={record.medications} />
          <ChipCard label="Lab findings" items={record.lab_findings} />
          <ChipCard label="Procedures" items={record.procedures} />
          <ChipCard label="Tests" items={record.tests} />
          {record.follow_up && (
            <div className="aayu-card grid gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-[#8A8F8C]">Follow-up</span>
              <p className="mt-1 text-sm leading-relaxed text-[#123C3A]">{record.follow_up}</p>
            </div>
          )}
          <ChipCard label="Amounts detected" items={amountChips} />
          <div className="aayu-card grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-medium uppercase tracking-wide text-[#8A8F8C]">Source documents</span>
              <button type="button" onClick={onViewDocuments} className="text-sm font-medium text-[#0F6E56]">View all</button>
            </div>
            {documents.length === 0 && <p className="text-sm text-[#55706C]">No documents yet.</p>}
            {documents.map((doc) => (
              <div key={doc.document_id} className="text-sm text-[#123C3A]">
                {doc.filename} <span className="text-[#8A8F8C]">· {KIND_LABELS[doc.kind] ?? doc.kind}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export function SchemesScreen({ patient }: { patient: Patient | null }) {
  const [saveProfile, profileState] = useSaveEligibilityProfileMutation();
  const [fetchMatches, { data, isFetching: isMatching }] = useLazyEligibilityMatchesQuery();
  const [error, setError] = useState("");
  const matches = data ?? [];

  async function checkEligibility(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!patient) return;
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      await saveProfile({
        patientId: patient.id,
        monthly_household_income: Number(form.get("monthly_household_income")),
        employment_type: String(form.get("employment_type")) as EmploymentType,
        has_bpl_or_antyodaya_ration_card: form.get("has_bpl_or_antyodaya_ration_card") === "on",
        has_disability: form.get("has_disability") === "on",
        is_pregnant_or_recent_mother: form.get("is_pregnant_or_recent_mother") === "on",
      }).unwrap();
      await fetchMatches(patient.id).unwrap();
    } catch {
      setError("We couldn&rsquo;t check eligibility. Please try again.");
    }
  }

  return (
    <section aria-labelledby="schemes-title" className="grid gap-4">
      <ScreenTitle>Schemes</ScreenTitle>
      <p className="text-sm leading-relaxed text-[#55706C]">
        A few details to check eligibility for government health schemes. This stays with the patient&rsquo;s
        record and isn&rsquo;t shared outside Aayu.
      </p>

      <form className="aayu-card grid gap-5" onSubmit={checkEligibility}>
        <label>
          Monthly household income (INR)
          <input required name="monthly_household_income" type="number" min={0} />
        </label>
        <label>
          Employment type
          <select required name="employment_type" defaultValue="unorganized_sector_or_self_employed">
            {Object.entries(EMPLOYMENT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <div className="grid gap-2">
          <label className="flex items-center justify-between gap-3 rounded-lg border border-[#E4E2DA] px-3 py-2.5 font-normal">
            Has a BPL or Antyodaya ration card
            <input name="has_bpl_or_antyodaya_ration_card" type="checkbox" className="shrink-0" />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-lg border border-[#E4E2DA] px-3 py-2.5 font-normal">
            Has a disability
            <input name="has_disability" type="checkbox" className="shrink-0" />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-lg border border-[#E4E2DA] px-3 py-2.5 font-normal">
            Pregnant or a recent mother
            <input name="is_pregnant_or_recent_mother" type="checkbox" className="shrink-0" />
          </label>
        </div>
        <button className="primary-button" disabled={!patient || profileState.isLoading || isMatching}>
          Check eligibility
        </button>
      </form>

      {(profileState.isLoading || isMatching) && (
        <div className="aayu-card text-[#55706C]">Checking eligibility…</div>
      )}

      {error && <div className="aayu-card text-[#A23D32]" role="alert">{error}</div>}

      {data && !isMatching && matches.length === 0 && (
        <div className="aayu-card text-[#55706C]">No schemes matched based on these details.</div>
      )}

      {matches.map((scheme) => (
        <div key={scheme.scheme_code} className="aayu-card grid gap-2">
          <span className="font-medium text-[#123C3A]">{scheme.name}</span>
          <span className="text-xs font-medium uppercase tracking-wide text-[#8A8F8C]">{scheme.authority}</span>
          <p className="text-sm leading-relaxed text-[#55706C]">{scheme.benefit_summary}</p>
          <p className="text-sm leading-relaxed text-[#55706C]">{scheme.explanation}</p>
          <a className="text-sm font-medium text-[#0F6E56] underline" href={scheme.official_url} target="_blank" rel="noreferrer">
            Official source
          </a>
        </div>
      ))}
    </section>
  );
}
