import { type FormEvent, useState } from "react";

import { useAppSelector } from "../../app/store";
import {
  useAcceptConsentMutation,
  useCompleteUploadMutation,
  useCreatePatientMutation,
  useCreateUploadIntentMutation,
  useJobQuery,
  usePatientsQuery,
  uploadFile,
} from "../../services/api";

type Step = "patient" | "consent" | "upload" | "processing";

export function HeroFlow() {
  const token = useAppSelector((state) => state.auth.token);
  const { data: patients = [], isLoading } = usePatientsQuery();
  const [createPatient, patientState] = useCreatePatientMutation();
  const [acceptConsent, consentState] = useAcceptConsentMutation();
  const [createIntent, intentState] = useCreateUploadIntentMutation();
  const [completeUpload] = useCompleteUploadMutation();
  const [step, setStep] = useState<Step>("patient");
  const [patientId, setPatientId] = useState("");
  const [jobId, setJobId] = useState("");
  const [message, setMessage] = useState("");
  const { data: job } = useJobQuery(jobId, {
    skip: !jobId,
    pollingInterval: jobId ? 3000 : 0,
  });

  async function addPatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const patient = await createPatient({
      name: String(data.get("name")),
      relationship: String(data.get("relationship")),
    }).unwrap();
    setPatientId(patient.id);
    setStep("consent");
  }

  async function consent() {
    await acceptConsent(patientId).unwrap();
    setStep("upload");
  }

  async function submitDocuments(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const data = new FormData(event.currentTarget);
    const file = data.get("document");
    if (!(file instanceof File) || file.size === 0) return setMessage("Choose a PDF or photo first.");
    try {
      const intent = await createIntent({
        patientId,
        filename: file.name,
        content_type: file.type,
        kind: String(data.get("kind")),
      }).unwrap();
      await uploadFile(intent, file, token);
      const queued = await completeUpload(intent.document_id).unwrap();
      setJobId(queued.id);
      setStep("processing");
    } catch {
      setMessage("We couldn't upload that file. Check it and try again.");
    }
  }

  if (isLoading) return <StateCard title="Preparing your account…" />;

  return (
    <main className="mx-auto min-h-screen max-w-[720px] px-4 py-8 sm:py-14">
      <header className="mb-10 flex items-center justify-between">
        <span className="text-xl font-medium text-[#042C53]">Aayu</span>
        <span className="rounded-full bg-[#E3F2ED] px-3 py-1 text-xs text-[#0F6E56]">Private and encrypted</span>
      </header>

      {step === "patient" && (
        <section aria-labelledby="patient-title">
          <p className="mb-2 text-sm text-[#55706C]">First, who are we helping?</p>
          <h1 id="patient-title" className="mb-3 text-3xl font-medium text-[#042C53]">Create a patient profile</h1>
          <p className="mb-8 text-[#55706C]">Their claim documents and health record stay together.</p>
          {patients.length > 0 && (
            <div className="mb-6 grid gap-3">
              {patients.map((patient) => (
                <button
                  className="aayu-card text-left"
                  key={patient.id}
                  onClick={() => { setPatientId(patient.id); setStep("consent"); }}
                  type="button"
                >
                  <span className="block font-medium text-[#123C3A]">{patient.name}</span>
                  <span className="text-sm text-[#55706C]">{patient.relationship}</span>
                </button>
              ))}
            </div>
          )}
          <form className="aayu-card grid gap-5" onSubmit={addPatient}>
            <label>Name<input required name="name" placeholder="e.g. Appa" maxLength={120} /></label>
            <label>Relationship<select required name="relationship" defaultValue="father"><option value="father">Father</option><option value="mother">Mother</option><option value="spouse">Spouse</option><option value="other">Other</option></select></label>
            <button className="primary-button" disabled={patientState.isLoading}>Continue with this patient</button>
          </form>
        </section>
      )}

      {step === "consent" && (
        <section aria-labelledby="consent-title" className="aayu-card">
          <p className="mb-2 text-sm text-[#55706C]">Before the first upload</p>
          <h1 id="consent-title" className="mb-4 text-3xl font-medium text-[#042C53]">You stay in control</h1>
          <p className="mb-6 text-[#55706C]">Aayu will securely process these documents to assess the claim and build this patient's health record. We won't use them for advertising.</p>
          <button className="primary-button" onClick={consent} disabled={consentState.isLoading}>I understand, continue</button>
        </section>
      )}

      {step === "upload" && (
        <section aria-labelledby="upload-title">
          <h1 id="upload-title" className="mb-3 text-3xl font-medium text-[#042C53]">Upload the claim document</h1>
          <p className="mb-8 text-[#55706C]">Start with the rejection letter. You can add the policy and bills next.</p>
          <form className="aayu-card grid gap-5" onSubmit={submitDocuments}>
            <label>Document type<select name="kind" defaultValue="rejection_letter"><option value="rejection_letter">Rejection letter</option><option value="policy">Policy</option><option value="bill">Hospital bill</option><option value="discharge_summary">Discharge summary</option></select></label>
            <label>PDF or photo<input required name="document" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" /></label>
            {message && <p role="alert" className="text-sm text-[#A23D32]">{message}</p>}
            <button className="primary-button" disabled={intentState.isLoading}>Upload and assess</button>
          </form>
        </section>
      )}

      {step === "processing" && (
        <StateCard
          title={job?.status === "failed" ? "We couldn't read this document" : "Finding the relevant claim details…"}
          body={job?.status === "failed" ? "Check the document and try uploading it again." : "Your file is safely uploaded. You can leave this screen while we process it."}
        />
      )}
    </main>
  );
}

function StateCard({ title, body }: { title: string; body?: string }) {
  return <main className="mx-auto max-w-[720px] px-4 py-20"><section className="aayu-card" aria-live="polite"><h1 className="mb-3 text-2xl font-medium text-[#042C53]">{title}</h1>{body && <p className="text-[#55706C]">{body}</p>}</section></main>;
}
