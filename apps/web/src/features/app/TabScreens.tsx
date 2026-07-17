import { type FormEvent, type ReactNode, useState } from "react";

import {
  useDocumentsQuery,
  useClaimQuery,
  useHealthQuery,
  useEligibilityMatchesQuery,
  useSaveEligibilityProfileMutation,
  type EligibilityMatch,
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

function ScreenTitle({ children }: { children: ReactNode }) {
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
  const { data: documentList = [] } = useDocumentsQuery(patient?.id ?? "", { skip: !patient?.id });
  const { data: claim } = useClaimQuery(patient?.id ?? "", { skip: !patient?.id });
  const name = patient?.name ?? "your family";
  const profile = patient?.profile;
  const record = data?.data;
  const amountChips = record?.amounts?.map((amount) => `₹${amount.toLocaleString("en-IN")}`);
  const documents = record?.documents ?? [];
  const hasProfileData = Boolean(profile && (profile.blood_group || profile.medical_history.length || profile.allergies.length || profile.medications.length || profile.chronic_conditions.length || profile.preferred_hospital || profile.preferred_doctor));
  const hasHealthData = Boolean(hasProfileData || (record && (record.summary || record.conditions?.length || record.medications?.length || record.lab_findings?.length || record.procedures?.length || record.tests?.length || record.follow_up || documents.length)));
  const missingUploads = [
    ["prescription", "a prescription"], ["lab_report", "a lab report"], ["discharge_summary", "a discharge summary"], ["insurance_document", "insurance proof"],
  ].filter(([kind]) => !documentList.some((document) => document.kind === kind));
  const conditions = [...new Set([...(profile?.chronic_conditions ?? []), ...(record?.conditions ?? [])])];
  const medications = [...new Set([...(profile?.medications ?? []), ...(record?.medications ?? [])])];
  const allergies = profile?.allergies ?? [];

  return (
    <section aria-labelledby="health-title" className="grid gap-4">
      <div>
        <ScreenTitle>{name}&rsquo;s health</ScreenTitle>
        <p className="mt-1 text-sm text-[#55706C]">Built from the care profile and documents you add.</p>
      </div>
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
          <div className="grid grid-cols-3 gap-3">
            {[['Conditions', conditions.length], ['Medicines', medications.length], ['Allergies', allergies.length]].map(([label, value]) => <div key={String(label)} className="aayu-card p-4"><span className="text-xs font-medium uppercase tracking-wide text-[#8A8F8C]">{label}</span><strong className="mt-1 block text-2xl font-medium text-[#123C3A]">{value}</strong></div>)}
          </div>
          <div className="aayu-card grid gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-[#8A8F8C]">Care snapshot</span>
            <p className="text-sm text-[#55706C]">
              {[profile?.blood_group && `Blood group: ${profile.blood_group}`, profile?.preferred_doctor && `Doctor: ${profile.preferred_doctor}`, profile?.preferred_hospital && `Hospital: ${profile.preferred_hospital}`].filter(Boolean).join(" · ") || "Complete the profile so care preferences are available when you need them."}
            </p>
          </div>
          <ChipCard label="Conditions" items={conditions} />
          <ChipCard label="Known allergies" items={allergies} />
          <ChipCard label="Current medicines" items={medications} />
          <ChipCard label="Medical history" items={profile?.medical_history} />
          {record.summary && (
            <div className="aayu-card grid gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-[#8A8F8C]">Summary</span>
              <p className="mt-1 text-sm leading-relaxed text-[#123C3A]">{record.summary}</p>
            </div>
          )}
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
          {missingUploads.length > 0 && (
            <div className="aayu-card grid gap-3">
              <span className="text-xs font-medium uppercase tracking-wide text-[#8A8F8C]">Suggested next steps</span>
              <p className="text-sm text-[#55706C]">Add {missingUploads.map(([, label]) => label).join(", ")} to make this record more useful for treatment and claims.</p>
              <button type="button" onClick={onViewDocuments} className="secondary-button w-fit">Review missing documents</button>
            </div>
          )}
          <div className="grid gap-3">
            <span className="text-xs font-medium uppercase tracking-wide text-[#8A8F8C]">Recent timeline</span>
            <div className="grid gap-3 border-l-2 border-[#C7D8D3] pl-4">
              {claim?.assessment && <div><span className="text-xs text-[#8A8F8C]">Claim update</span><p className="text-sm font-medium text-[#123C3A]">Claim assessment ready</p><p className="text-sm text-[#55706C]">{claim.assessment.reason}</p></div>}
              {documentList.slice(0, 4).map((document) => <div key={document.id}><span className="text-xs text-[#8A8F8C]">{new Date(document.created_at).toLocaleDateString("en-IN")}</span><p className="text-sm font-medium text-[#123C3A]">{KIND_LABELS[document.kind] ?? document.kind} added</p><p className="text-sm text-[#55706C]">{document.filename}</p></div>)}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function SchemeMatchCard({ scheme }: { scheme: EligibilityMatch }) {
  return (
    <div className="aayu-card grid gap-2">
      <span className="font-medium text-[#123C3A]">{scheme.name}</span>
      <span className="text-xs font-medium uppercase tracking-wide text-[#8A8F8C]">{scheme.authority}</span>
      <p className="text-sm leading-relaxed text-[#55706C]">{scheme.benefit_summary}</p>
      <p className="text-sm leading-relaxed text-[#55706C]">{scheme.explanation}</p>
      <a className="text-sm font-medium text-[#0F6E56] underline" href={scheme.official_url} target="_blank" rel="noreferrer">
        Official source
      </a>
    </div>
  );
}

export function SchemesScreen({ patient }: { patient: Patient | null }) {
  const [saveProfile, profileState] = useSaveEligibilityProfileMutation();
  const { data, isFetching } = useEligibilityMatchesQuery(patient?.id ?? "", { skip: !patient?.id });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formOpenOverride, setFormOpenOverride] = useState<boolean | null>(null);

  const matches = data ?? [];
  const hasMatches = matches.length > 0;
  const firstLoadPending = isFetching && data === undefined;
  const formOpen = formOpenOverride ?? !hasMatches;
  const busy = profileState.isLoading || isFetching;
  const checked = submitted || hasMatches;
  const profile = patient?.profile;

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
      setSubmitted(true);
      setFormOpenOverride(null);
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

      {firstLoadPending && <div className="aayu-card text-[#55706C]">Checking eligibility…</div>}

      {!firstLoadPending && (
        <>
          {hasMatches && (
            <>
              <p className="text-sm text-[#55706C]">Based on the eligibility details you saved.</p>
              {matches.map((scheme) => (
                <SchemeMatchCard key={scheme.scheme_code} scheme={scheme} />
              ))}
              <button
                type="button"
                className="secondary-button w-fit"
                onClick={() => setFormOpenOverride(!formOpen)}
              >
                Update details
              </button>
            </>
          )}

          {formOpen && (
            <form className="aayu-card grid gap-5" onSubmit={checkEligibility}>
              <label>
                Monthly household income (INR)
                <input required name="monthly_household_income" type="number" min={0} defaultValue={profile?.monthly_household_income ?? ""} />
              </label>
              <label>
                Employment type
                <select required name="employment_type" defaultValue={profile?.employment_type ?? "unorganized_sector_or_self_employed"}>
                  {Object.entries(EMPLOYMENT_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <div className="grid gap-2">
                <label className="flex items-center justify-between gap-3 rounded-lg border border-[#E4E2DA] px-3 py-2.5 font-normal">
                  Has a BPL or Antyodaya ration card
                  <input name="has_bpl_or_antyodaya_ration_card" type="checkbox" className="shrink-0" defaultChecked={profile?.has_bpl_or_antyodaya_ration_card ?? false} />
                </label>
                <label className="flex items-center justify-between gap-3 rounded-lg border border-[#E4E2DA] px-3 py-2.5 font-normal">
                  Has a disability
                  <input name="has_disability" type="checkbox" className="shrink-0" defaultChecked={profile?.has_disability ?? false} />
                </label>
                <label className="flex items-center justify-between gap-3 rounded-lg border border-[#E4E2DA] px-3 py-2.5 font-normal">
                  Pregnant or a recent mother
                  <input name="is_pregnant_or_recent_mother" type="checkbox" className="shrink-0" defaultChecked={profile?.is_pregnant_or_recent_mother ?? false} />
                </label>
              </div>
              <button className="primary-button" disabled={!patient || busy}>
                Check eligibility
              </button>
            </form>
          )}

          {busy && <div className="aayu-card text-[#55706C]">Checking eligibility…</div>}

          {error && <div className="aayu-card text-[#A23D32]" role="alert">{error}</div>}

          {!busy && checked && matches.length === 0 && (
            <div className="aayu-card text-[#55706C]">No schemes matched based on these details.</div>
          )}
        </>
      )}
    </section>
  );
}
