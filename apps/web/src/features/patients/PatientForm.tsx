import { type FormEvent, type ReactNode } from "react";

import type { Patient, PatientInput } from "../../services/api";

type PatientFormProps = {
  patient?: Patient;
  busy: boolean;
  onCancel?: () => void;
  onSave: (input: PatientInput) => Promise<void>;
  submitLabel?: string;
  message?: string;
  secondaryAction?: ReactNode;
  detailed?: boolean;
};

export function PatientForm({ patient, busy, onCancel, onSave, submitLabel, message, secondaryAction, detailed = true }: PatientFormProps) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (name: string) => String(data.get(name) ?? "").trim() || null;
    const lines = (name: string) => String(data.get(name) ?? "").split("\n").map((value) => value.trim()).filter(Boolean);
    await onSave({
      name: String(data.get("name")).trim(),
      relationship: String(data.get("relationship")),
      date_of_birth: String(data.get("date_of_birth")) || null,
      profile: {
        gender: text("gender"),
        blood_group: text("blood_group"),
        insurance_provider: text("insurance_provider"),
        insurance_policy_number: text("insurance_policy_number"),
        insurance_policy_expiry: String(data.get("insurance_policy_expiry") ?? "") || null,
        medical_history: lines("medical_history"),
        allergies: lines("allergies"),
        medications: lines("medications"),
        chronic_conditions: lines("chronic_conditions"),
        consultation_history: lines("consultation_history"),
        emergency_contact_name: text("emergency_contact_name"),
        emergency_contact_relationship: text("emergency_contact_relationship"),
        emergency_contact_phone: text("emergency_contact_phone"),
        preferred_hospital: text("preferred_hospital"),
        preferred_doctor: text("preferred_doctor"),
      },
    });
  }

  const profile = patient?.profile;

  return (
    <form className="aayu-card grid gap-5" onSubmit={(event) => void submit(event)}>
      <label>Name<input required name="name" defaultValue={patient?.name} maxLength={120} placeholder="e.g. Appa" /></label>
      <label>Relationship
        <select required name="relationship" defaultValue={patient?.relationship ?? "father"}>
          <option value="father">Father</option><option value="mother">Mother</option><option value="spouse">Spouse</option><option value="other">Other</option>
        </select>
      </label>
      <label>Date of birth <span className="font-normal text-[#55706C]">(optional)</span>
        <input name="date_of_birth" type="date" defaultValue={patient?.date_of_birth ?? ""} />
      </label>
      {detailed && <>
      <fieldset className="grid gap-4 border-t border-[#E4E2DA] pt-5">
        <legend className="text-base font-medium text-[#123C3A]">Health and insurance</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>Gender
            <select name="gender" defaultValue={profile?.gender ?? ""}>
              <option value="">Prefer not to say</option><option value="female">Female</option><option value="male">Male</option><option value="non_binary">Non-binary</option><option value="other">Other</option>
            </select>
          </label>
          <label>Blood group
            <select name="blood_group" defaultValue={profile?.blood_group ?? ""}>
              <option value="">Unknown</option>{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => <option key={group}>{group}</option>)}
            </select>
          </label>
          <label>Insurance provider<input name="insurance_provider" defaultValue={profile?.insurance_provider ?? ""} placeholder="e.g. Star Health" /></label>
          <label>Policy number<input name="insurance_policy_number" defaultValue={profile?.insurance_policy_number ?? ""} /></label>
          <label>Policy expiry<input name="insurance_policy_expiry" type="date" defaultValue={profile?.insurance_policy_expiry ?? ""} /></label>
        </div>
      </fieldset>
      <fieldset className="grid gap-4 border-t border-[#E4E2DA] pt-5">
        <legend className="text-base font-medium text-[#123C3A]">Care history</legend>
        <p className="text-sm text-[#55706C]">Add one item per line. This builds a structured record alongside uploaded documents.</p>
        <label>Medical history<textarea name="medical_history" rows={3} defaultValue={profile?.medical_history.join("\n") ?? ""} placeholder="Past surgeries, admissions, relevant diagnoses" /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>Allergies<textarea name="allergies" rows={3} defaultValue={profile?.allergies.join("\n") ?? ""} placeholder="Medicine, food, or environmental allergies" /></label>
          <label>Current medicines<textarea name="medications" rows={3} defaultValue={profile?.medications.join("\n") ?? ""} placeholder="Medicine and dose, if known" /></label>
        </div>
        <label>Chronic conditions<textarea name="chronic_conditions" rows={3} defaultValue={profile?.chronic_conditions.join("\n") ?? ""} placeholder="Diabetes, asthma, hypertension…" /></label>
        <label>Doctor consultations<textarea name="consultation_history" rows={3} defaultValue={profile?.consultation_history.join("\n") ?? ""} placeholder="Date — doctor/specialty — reason or advice" /></label>
      </fieldset>
      <fieldset className="grid gap-4 border-t border-[#E4E2DA] pt-5">
        <legend className="text-base font-medium text-[#123C3A]">Care preferences and emergency contact</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>Preferred hospital<input name="preferred_hospital" defaultValue={profile?.preferred_hospital ?? ""} /></label>
          <label>Preferred doctor<input name="preferred_doctor" defaultValue={profile?.preferred_doctor ?? ""} /></label>
          <label>Emergency contact name<input name="emergency_contact_name" defaultValue={profile?.emergency_contact_name ?? ""} /></label>
          <label>Relationship<input name="emergency_contact_relationship" defaultValue={profile?.emergency_contact_relationship ?? ""} /></label>
          <label>Phone<input name="emergency_contact_phone" type="tel" defaultValue={profile?.emergency_contact_phone ?? ""} /></label>
        </div>
      </fieldset>
      </>}
      {message && <p role="alert" className="text-sm text-[#A23D32]">{message}</p>}
      <div className="flex flex-wrap gap-3">
        <button className="primary-button" disabled={busy}>{submitLabel ?? (patient ? "Save changes" : "Continue with this patient")}</button>
        {onCancel && <button type="button" onClick={onCancel} className="secondary-button">Cancel</button>}
        {secondaryAction}
      </div>
    </form>
  );
}
