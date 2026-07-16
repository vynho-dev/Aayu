import { UserButton } from "@clerk/react";
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
import type { Patient } from "../../services/api";
import { AppShell, type Tab } from "../app/AppShell";
import { HealthScreen, SchemesScreen } from "../app/TabScreens";
import { HomeScreen } from "../home/HomeScreen";
import { PolicyQAScreen } from "../policy/PolicyQAScreen";
import { ClaimResultScreen } from "./ClaimResultScreen";

type ClaimStep = "consent" | "upload" | "processing";

const clerkActive = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

export function HeroFlow() {
  const token = useAppSelector((state) => state.auth.token);
  const { data: patients = [], isLoading } = usePatientsQuery();
  const [createPatient, patientState] = useCreatePatientMutation();
  const [acceptConsent, consentState] = useAcceptConsentMutation();
  const [createIntent, intentState] = useCreateUploadIntentMutation();
  const [completeUpload] = useCompleteUploadMutation();

  const [patientId, setPatientId] = useState("");
  const [consented, setConsented] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [claimStep, setClaimStep] = useState<ClaimStep | null>(null);
  const [qaOpen, setQaOpen] = useState(false);
  const [jobId, setJobId] = useState("");
  const [message, setMessage] = useState("");
  const { data: job } = useJobQuery(jobId, { skip: !jobId, pollingInterval: jobId ? 3000 : 0 });

  const patient = patients.find((p) => p.id === patientId) ?? null;

  async function addPatient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const created = await createPatient({
      name: String(data.get("name")),
      relationship: String(data.get("relationship")),
    }).unwrap();
    // After profile setup, land on the dashboard — not straight into the upload flow.
    setPatientId(created.id);
    setTab("home");
  }

  async function consent() {
    await acceptConsent(patientId).unwrap();
    setConsented(true);
    setClaimStep("upload");
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
      setClaimStep("processing");
    } catch {
      setMessage("We couldn't upload that file. Check it and try again.");
    }
  }

  const startClaim = () => {
    setMessage("");
    setQaOpen(false);
    setClaimStep(consented ? "upload" : "consent");
  };

  const backToHome = () => {
    setClaimStep(null);
    setQaOpen(false);
    setJobId("");
    setTab("home");
  };

  const onNav = (id: Tab) => {
    setQaOpen(false);
    if (id === "claim") return startClaim();
    setClaimStep(null);
    setTab(id);
  };

  if (isLoading) return <StateCard title="Preparing your account…" />;

  // Profile setup — create or select the patient before entering the app.
  if (!patientId) {
    return (
      <main className="mx-auto min-h-screen max-w-[720px] px-4 py-8 sm:py-14">
        <header className="mb-10 text-xl font-medium text-[#042C53]">Aayu</header>
        <section aria-labelledby="patient-title">
          <p className="mb-2 text-sm text-[#55706C]">First, who are we helping?</p>
          <h1 id="patient-title" className="mb-3 text-3xl font-medium text-[#042C53]">Create a patient profile</h1>
          <p className="mb-8 text-[#55706C]">Their claim documents and health record stay together.</p>
          {patients.length > 0 && (
            <div className="mb-6 grid gap-3">
              {patients.map((existing) => (
                <button
                  className="aayu-card text-left"
                  key={existing.id}
                  onClick={() => { setPatientId(existing.id); setTab("home"); }}
                  type="button"
                >
                  <span className="block font-medium text-[#123C3A]">{existing.name}</span>
                  <span className="text-sm text-[#55706C]">{existing.relationship}</span>
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
      </main>
    );
  }

  // Result is derived from the completed job — no separate state to keep in sync.
  const showResult = claimStep === "processing" && job?.status === "completed";

  let content;
  if (qaOpen) {
    content = (
      <PolicyQAScreen
        patient={patient}
        onBack={backToHome}
        onNeedPolicy={() => { setQaOpen(false); startClaim(); }}
      />
    );
  } else if (showResult) {
    content = (
      <ClaimResultScreen
        patient={patient}
        onViewHealth={() => { setClaimStep(null); setJobId(""); setTab("health"); }}
        onBack={backToHome}
      />
    );
  } else if (claimStep) {
    content = (
      <ClaimTask
        step={claimStep}
        patient={patient}
        job={job}
        message={message}
        consenting={consentState.isLoading}
        uploading={intentState.isLoading}
        onConsent={consent}
        onSubmit={submitDocuments}
        onBack={backToHome}
      />
    );
  } else if (tab === "home") {
    content = <HomeScreen patient={patient} onNewClaim={startClaim} onAskPolicy={() => setQaOpen(true)} onNav={onNav} />;
  } else if (tab === "health") {
    content = <HealthScreen patient={patient} />;
  } else if (tab === "schemes") {
    content = <SchemesScreen patient={patient} />;
  } else {
    content = <ProfileScreen patient={patient} onSwitchPatient={() => setPatientId("")} />;
  }

  return (
    <AppShell active={claimStep ? "claim" : tab} onNav={onNav}>
      {content}
    </AppShell>
  );
}

type ClaimTaskProps = {
  step: ClaimStep;
  patient: Patient | null;
  job: { status: string } | undefined;
  message: string;
  consenting: boolean;
  uploading: boolean;
  onConsent: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
};

function ClaimTask({ step, patient, job, message, consenting, uploading, onConsent, onSubmit, onBack }: ClaimTaskProps) {
  return (
    <div>
      <button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-[#0F6E56]">
        ← Back to dashboard
      </button>

      {step === "consent" && (
        <section aria-labelledby="consent-title" className="aayu-card">
          <p className="mb-2 text-sm text-[#55706C]">Before the first upload</p>
          <h1 id="consent-title" className="mb-4 text-3xl font-medium text-[#042C53]">You stay in control</h1>
          <p className="mb-6 text-[#55706C]">
            Aayu will securely process these documents to assess the claim and build{" "}
            {patient?.name ?? "this patient"}&rsquo;s health record. We won&rsquo;t use them for advertising.
          </p>
          <button className="primary-button" onClick={onConsent} disabled={consenting}>I understand, continue</button>
        </section>
      )}

      {step === "upload" && (
        <section aria-labelledby="upload-title">
          <h1 id="upload-title" className="mb-3 text-3xl font-medium text-[#042C53]">Upload the claim document</h1>
          <p className="mb-8 text-[#55706C]">Start with the rejection letter. You can add the policy and bills later.</p>
          <form className="aayu-card grid gap-5" onSubmit={onSubmit}>
            <label>Document type<select name="kind" defaultValue="rejection_letter"><option value="rejection_letter">Rejection letter</option><option value="policy">Policy</option><option value="bill">Hospital bill</option><option value="discharge_summary">Discharge summary</option></select></label>
            <label>PDF or photo<input required name="document" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" /></label>
            {message && <p role="alert" className="text-sm text-[#A23D32]">{message}</p>}
            <button className="primary-button" disabled={uploading}>Upload and assess</button>
          </form>
        </section>
      )}

      {step === "processing" && (
        <>
          <StateCard
            title={job?.status === "failed" ? "We couldn't read this document" : "Finding the relevant claim details…"}
            body={job?.status === "failed" ? "Check the document and try uploading it again." : "Your file is safely uploaded. You can leave this screen while we process it."}
          />
          <button type="button" onClick={onBack} className="primary-button mt-6">Back to dashboard</button>
        </>
      )}
    </div>
  );
}

function ProfileScreen({ patient, onSwitchPatient }: { patient: Patient | null; onSwitchPatient: () => void }) {
  return (
    <section aria-labelledby="profile-title" className="grid gap-5">
      <h1 id="profile-title" className="text-3xl font-medium text-[#042C53]">Profile</h1>
      <div className="aayu-card grid gap-1">
        <span className="font-medium text-[#123C3A]">{patient?.name ?? "Patient"}</span>
        <span className="text-sm text-[#55706C]">{patient?.relationship ?? ""}</span>
      </div>
      <div className="aayu-card flex items-center gap-3">
        {clerkActive ? <UserButton /> : null}
        <span className="text-sm text-[#55706C]">{clerkActive ? "Manage your account or sign out" : "Development session"}</span>
      </div>
      <button type="button" onClick={onSwitchPatient} className="text-left text-sm font-medium text-[#0F6E56]">Switch patient</button>
    </section>
  );
}

function StateCard({ title, body }: { title: string; body?: string }) {
  return (
    <section className="aayu-card" aria-live="polite">
      <h1 className="mb-3 text-2xl font-medium text-[#042C53]">{title}</h1>
      {body && <p className="text-[#55706C]">{body}</p>}
    </section>
  );
}
