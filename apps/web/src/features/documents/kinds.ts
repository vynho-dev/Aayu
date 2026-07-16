export const DOC_KIND_OPTIONS = [
  { value: "rejection_letter", label: "Rejection letter" },
  { value: "policy", label: "Policy" },
  { value: "insurance_document", label: "Insurance card or policy schedule" },
  { value: "bill", label: "Hospital bill" },
  { value: "discharge_summary", label: "Discharge summary" },
  { value: "lab_report", label: "Lab report" },
  { value: "prescription", label: "Prescription" },
  { value: "doctor_note", label: "Doctor note (audio/photo)" },
] as const;

export const KIND_LABELS: Record<string, string> = Object.fromEntries(
  DOC_KIND_OPTIONS.map((option) => [option.value, option.label]),
);

const STATUS_LABELS: Record<string, string> = {
  completed: "Ready",
  failed: "Couldn't read",
};

export function statusLabel(status: string): string {
  return STATUS_LABELS[status] ?? "Processing…";
}
