import { useState } from "react";

import type { Patient, PatientInput, PatientProfile } from "../../services/api";

type PatientFormProps = {
  patient?: Patient;
  busy: boolean;
  onCancel?: () => void;
  onSave: (input: PatientInput) => Promise<void>;
  submitLabel?: string;
  message?: string;
};

type Draft = Omit<PatientProfile, "medical_history" | "allergies" | "medications" | "chronic_conditions" | "consultation_history"> & {
  name: string;
  relationship: string;
  date_of_birth: string;
  medical_history: string;
  allergies: string;
  medications: string;
  chronic_conditions: string;
  consultation_history: string[];
};

const relationships = [
  ["self", "Myself"], ["mother", "Mother"], ["father", "Father"], ["spouse", "Spouse or partner"],
  ["child", "Child"], ["sibling", "Sibling"], ["family_member", "Another family member"], ["other", "Someone else"],
] as const;
const employment = [
  ["government_employee_or_pensioner", "Government employee or pensioner"], ["organized_sector_employee", "Organised-sector employee"],
  ["unorganized_sector_or_self_employed", "Self-employed or unorganised sector"], ["farmer", "Farmer"], ["unemployed", "Not currently employed"],
] as const;

const text = (value: string) => value.trim() || null;
const lines = (value: string) => value.split("\n").map((item) => item.trim()).filter(Boolean);

function initialDraft(patient?: Patient): Draft {
  const profile = patient?.profile;
  return {
    name: patient?.name ?? "", relationship: patient?.relationship ?? "self", date_of_birth: patient?.date_of_birth ?? "",
    gender: profile?.gender ?? null, state: profile?.state ?? null, district: profile?.district ?? null, pincode: profile?.pincode ?? null,
    blood_group: profile?.blood_group ?? null, insurance_status: profile?.insurance_status ?? null, insurance_provider: profile?.insurance_provider ?? null,
    insurance_policy_number: profile?.insurance_policy_number ?? null, insurance_policy_expiry: profile?.insurance_policy_expiry ?? null,
    medical_history: profile?.medical_history.join("\n") ?? "", allergies: profile?.allergies.join("\n") ?? "", medications: profile?.medications.join("\n") ?? "", chronic_conditions: profile?.chronic_conditions.join("\n") ?? "",
    consultation_history: profile?.consultation_history ?? [], emergency_contact_name: profile?.emergency_contact_name ?? null, emergency_contact_relationship: profile?.emergency_contact_relationship ?? null,
    emergency_contact_phone: profile?.emergency_contact_phone ?? null, preferred_hospital: profile?.preferred_hospital ?? null, preferred_doctor: profile?.preferred_doctor ?? null,
    abha_number: profile?.abha_number ?? null, ayushman_card_number: profile?.ayushman_card_number ?? null, monthly_household_income: profile?.monthly_household_income ?? null,
    employment_type: profile?.employment_type ?? null, has_bpl_or_antyodaya_ration_card: profile?.has_bpl_or_antyodaya_ration_card ?? false,
    has_disability: profile?.has_disability ?? false, is_pregnant_or_recent_mother: profile?.is_pregnant_or_recent_mother ?? false,
  };
}

function toInput(draft: Draft): PatientInput {
  return {
    name: draft.name.trim(), relationship: draft.relationship, date_of_birth: draft.date_of_birth || null,
    profile: {
      gender: draft.gender, state: draft.state, district: draft.district, pincode: draft.pincode, blood_group: draft.blood_group,
      insurance_status: draft.insurance_status, insurance_provider: draft.insurance_provider, insurance_policy_number: draft.insurance_policy_number,
      insurance_policy_expiry: draft.insurance_policy_expiry, medical_history: lines(draft.medical_history), allergies: lines(draft.allergies),
      medications: lines(draft.medications), chronic_conditions: lines(draft.chronic_conditions), consultation_history: draft.consultation_history,
      emergency_contact_name: draft.emergency_contact_name, emergency_contact_relationship: draft.emergency_contact_relationship,
      emergency_contact_phone: draft.emergency_contact_phone, preferred_hospital: draft.preferred_hospital, preferred_doctor: draft.preferred_doctor,
      abha_number: draft.abha_number, ayushman_card_number: draft.ayushman_card_number, monthly_household_income: draft.monthly_household_income,
      employment_type: draft.employment_type, has_bpl_or_antyodaya_ration_card: draft.has_bpl_or_antyodaya_ration_card,
      has_disability: draft.has_disability, is_pregnant_or_recent_mother: draft.is_pregnant_or_recent_mother,
    },
  };
}

export function PatientForm({ patient, busy, onCancel, onSave, submitLabel, message }: PatientFormProps) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(() => initialDraft(patient));
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const save = () => onSave(toInput(draft));
  const title = ["About this person", "Care and cover", "Health details", "Schemes and safety"][step];

  return (
    <form className="aayu-card grid gap-5" onSubmit={(event) => { event.preventDefault(); if (step < 3) setStep((current) => current + 1); else void save(); }}>
      <div className="flex items-center justify-between gap-4"><div><p className="aayu-text-label font-medium uppercase tracking-wide text-(--aayu-text-secondary)">Step {step + 1} of 4</p><h2 className="aayu-text-h2 mt-1 font-medium">{title}</h2></div><div className="flex gap-1.5" aria-label={`Step ${step + 1} of 4`}>{[0, 1, 2, 3].map((item) => <span key={item} className="h-1.5 w-6 rounded-full" style={{ background: item <= step ? "var(--aayu-teal-600)" : "var(--aayu-border)" }} />)}</div></div>

      {step === 0 && <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">Name<input required value={draft.name} onChange={(event) => set("name", event.target.value)} placeholder="e.g. Meera, Mum or Appa" maxLength={120} /></label>
        <label>Who is this profile for?<select value={draft.relationship} onChange={(event) => set("relationship", event.target.value)}>{relationships.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>Date of birth <span className="font-normal text-(--aayu-text-secondary)">(optional)</span><input type="date" value={draft.date_of_birth} onChange={(event) => set("date_of_birth", event.target.value)} /></label>
        <label>Gender <select value={draft.gender ?? ""} onChange={(event) => set("gender", text(event.target.value))}><option value="">Prefer not to say</option><option value="female">Female</option><option value="male">Male</option><option value="non_binary">Non-binary</option><option value="other">Other</option></select></label>
      </div>}

      {step === 1 && <div className="grid gap-4 sm:grid-cols-2">
        <label>State<input value={draft.state ?? ""} onChange={(event) => set("state", text(event.target.value))} placeholder="e.g. Telangana" /></label><label>District<input value={draft.district ?? ""} onChange={(event) => set("district", text(event.target.value))} /></label><label>Pincode<input inputMode="numeric" value={draft.pincode ?? ""} onChange={(event) => set("pincode", text(event.target.value))} /></label>
        <label>Insurance status<select value={draft.insurance_status ?? ""} onChange={(event) => set("insurance_status", text(event.target.value))}><option value="">Not sure yet</option><option value="insured">Has health insurance</option><option value="not_insured">Does not have health insurance</option></select></label>
        {draft.insurance_status === "insured" && <><label>Insurance provider<input value={draft.insurance_provider ?? ""} onChange={(event) => set("insurance_provider", text(event.target.value))} placeholder="e.g. Star Health" /></label><label>Policy number <span className="font-normal text-(--aayu-text-secondary)">(optional)</span><input value={draft.insurance_policy_number ?? ""} onChange={(event) => set("insurance_policy_number", text(event.target.value))} /></label></>}
      </div>}

      {step === 2 && <div className="grid gap-4"><p className="aayu-text-body-sm text-(--aayu-text-secondary)">Add only what you know. One item per line helps Aayu use the right context for claims and care.</p><label>Existing medical conditions<textarea rows={3} value={draft.chronic_conditions} onChange={(event) => set("chronic_conditions", event.target.value)} placeholder="Diabetes, asthma, hypertension…" /></label><label>Medical history<textarea rows={3} value={draft.medical_history} onChange={(event) => set("medical_history", event.target.value)} placeholder="Past admissions, surgeries, or important diagnoses" /></label><div className="grid gap-4 sm:grid-cols-2"><label>Allergies<textarea rows={3} value={draft.allergies} onChange={(event) => set("allergies", event.target.value)} /></label><label>Current medicines<textarea rows={3} value={draft.medications} onChange={(event) => set("medications", event.target.value)} /></label><label>Preferred hospital<input value={draft.preferred_hospital ?? ""} onChange={(event) => set("preferred_hospital", text(event.target.value))} placeholder="Optional" /></label><label>Preferred doctor<input value={draft.preferred_doctor ?? ""} onChange={(event) => set("preferred_doctor", text(event.target.value))} placeholder="Optional" /></label></div></div>}

      {step === 3 && <div className="grid gap-4 sm:grid-cols-2"><p className="aayu-text-body-sm sm:col-span-2 text-(--aayu-text-secondary)">These details are optional. They can help personalise scheme guidance and make urgent information easier to find.</p><label>Monthly household income (INR)<input type="number" min="0" value={draft.monthly_household_income ?? ""} onChange={(event) => set("monthly_household_income", event.target.value === "" ? null : Number(event.target.value))} /></label><label>Employment type<select value={draft.employment_type ?? ""} onChange={(event) => set("employment_type", text(event.target.value))}><option value="">Prefer not to say</option>{employment.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>ABHA number <span className="font-normal text-(--aayu-text-secondary)">(optional)</span><input value={draft.abha_number ?? ""} onChange={(event) => set("abha_number", text(event.target.value))} /></label><label>Ayushman card number <span className="font-normal text-(--aayu-text-secondary)">(optional)</span><input value={draft.ayushman_card_number ?? ""} onChange={(event) => set("ayushman_card_number", text(event.target.value))} /></label><label>Emergency contact name<input value={draft.emergency_contact_name ?? ""} onChange={(event) => set("emergency_contact_name", text(event.target.value))} /></label><label>Emergency contact phone<input type="tel" value={draft.emergency_contact_phone ?? ""} onChange={(event) => set("emergency_contact_phone", text(event.target.value))} /></label><label className="flex items-center justify-between gap-3 rounded-lg border border-(--aayu-border) px-3 py-2.5 font-normal sm:col-span-2">Has a BPL or Antyodaya ration card<input type="checkbox" checked={draft.has_bpl_or_antyodaya_ration_card} onChange={(event) => set("has_bpl_or_antyodaya_ration_card", event.target.checked)} /></label></div>}

      {message && <p role="alert" className="aayu-text-body-sm text-(--aayu-danger)">{message}</p>}
      <div className="flex flex-wrap items-center gap-3"><button type="button" className="secondary-button" disabled={step === 0 || busy} onClick={() => setStep((current) => current - 1)}>Back</button><button className="primary-button" disabled={busy || !draft.name.trim()}>{step === 3 ? (submitLabel ?? "Save profile") : "Continue"}</button><button type="button" className="aayu-text-body-sm font-medium text-(--aayu-teal-700)" disabled={busy || !draft.name.trim()} onClick={() => void save()}>Save and finish later</button>{onCancel && <button type="button" className="aayu-text-body-sm text-(--aayu-text-secondary)" onClick={onCancel}>Cancel</button>}</div>
    </form>
  );
}
