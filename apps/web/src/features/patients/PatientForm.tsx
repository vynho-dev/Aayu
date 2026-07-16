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
};

export function PatientForm({ patient, busy, onCancel, onSave, submitLabel, message, secondaryAction }: PatientFormProps) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await onSave({
      name: String(data.get("name")).trim(),
      relationship: String(data.get("relationship")),
      date_of_birth: String(data.get("date_of_birth")) || null,
    });
  }

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
      {message && <p role="alert" className="text-sm text-[#A23D32]">{message}</p>}
      <div className="flex flex-wrap gap-3">
        <button className="primary-button" disabled={busy}>{submitLabel ?? (patient ? "Save changes" : "Continue with this patient")}</button>
        {onCancel && <button type="button" onClick={onCancel} className="secondary-button">Cancel</button>}
        {secondaryAction}
      </div>
    </form>
  );
}
