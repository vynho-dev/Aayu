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
import { DocumentsScreen } from "../documents/DocumentsScreen";
import { DOC_KIND_OPTIONS } from "../documents/kinds";
import { HomeScreen } from "../home/HomeScreen";
import { PolicyQAScreen } from "../policy/PolicyQAScreen";
import { ClaimResultScreen } from "./ClaimResultScreen";

type ClaimStep = "consent" | "upload" | "processing";
type UploadMode = "claim" | "document";

const clerkActive = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

export function HeroFlow() {
  const token = useAppSelector((state) => state.auth.token);
  const { data: patients = [], isLoading } = usePatientsQuery();
  const [createPatient, patientState] = useCreatePatientMutation();
  const [acceptConsent, consentState] = useAcceptConsentMutation();
  const [createIntent, intentState] = useCreateUploadIntentMutation();
  const [completeUpload] = useCompleteUploadMutation();

  const [patientId, setPatientId] = useState("");
  const [previousPatientId, setPreviousPatientId] = useState("");
  const [consented, setConsented] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [claimStep, setClaimStep] = useState<ClaimStep | null>(null);
  const [uploadMode, setUploadMode] = useState<UploadMode>("claim");
  const [qaOpen, setQaOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [jobId, setJobId] = useState("");
  const [message, setMessage] = useState("");
  const { data: job } = useJobQuery(jobId, { skip: !jobId, pollingInterval: jobId ? 3000 : 0 });

  const patient = patients.find((p) => p.id === patientId) ?? null;

  const switchPatient = () => {
    setPreviousPatientId(patientId);
    setPatientId("");
  };

  const cancelSwitchPatient = () => {
    setPatientId(previousPatientId);
    setPreviousPatientId("");
    setTab("profile");
  };

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

  const launchUpload = (mode: UploadMode) => {
    setMessage("");
    setUploadMode(mode);
    setQaOpen(false);
    setDocsOpen(false);
    setClaimStep(consented ? "upload" : "consent");
  };
  const startClaim = () => launchUpload("claim");

  const backToHome = () => {
    setClaimStep(null);
    setQaOpen(false);
    setDocsOpen(false);
    setJobId("");
    setTab("home");
  };

  const uploadDone = () => {
    setClaimStep(null);
    setJobId("");
    setDocsOpen(true);
  };

  const onNav = (id: Tab) => {
    setQaOpen(false);
    setDocsOpen(false);
    if (id === "claim") return startClaim();
    setClaimStep(null);
    setTab(id);
  };

  if (isLoading) return <StateCard title="Preparing your account…" />;

  // Profile setup — create or select the patient before entering the app.
  if (!patientId) {
    return (
      <main className="mx-auto min-h-screen max-w-200 px-4 py-8 sm:py-14">
        <header className="aayu-text-h1 mb-10 font-medium text-(--aayu-ink-900)">Aayu</header>
        <section aria-labelledby="patient-title">
          {previousPatientId && (
            <button
              type="button"
              onClick={cancelSwitchPatient}
              className="aayu-text-body-sm mb-6 inline-flex items-center gap-1 font-medium text-(--aayu-teal-600)"
            >
              ← Back to profile
            </button>
          )}
          <p className="aayu-text-body-sm mb-2 text-(--aayu-text-secondary)">First, who are we helping?</p>
          <h1 id="patient-title" className="aayu-text-display mb-3 font-medium text-(--aayu-ink-900)">Create a patient profile</h1>
          <p className="aayu-text-body-sm mb-8 text-(--aayu-text-secondary)">Their claim documents and health record stay together.</p>
          {patients.length > 0 && (
            <div className="mb-6 grid gap-3">
              {patients.map((existing) => (
                <button
                  className="aayu-card text-left"
                  key={existing.id}
                  onClick={() => { setPatientId(existing.id); setTab("home"); }}
                  type="button"
                >
                  <span className="aayu-text-body-sm block font-medium text-(--aayu-text-primary)">{existing.name}</span>
                  <span className="aayu-text-body-sm text-(--aayu-text-secondary)">{existing.relationship}</span>
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

  // The claim result is derived from the completed job (claim uploads only).
  const showResult = uploadMode === "claim" && claimStep === "processing" && job?.status === "completed";

  let content;
  if (qaOpen) {
    content = (
      <PolicyQAScreen
        patient={patient}
        onBack={backToHome}
        onNeedPolicy={() => launchUpload("document")}
      />
    );
  } else if (docsOpen) {
    content = <DocumentsScreen patient={patient} onBack={backToHome} onAdd={() => launchUpload("document")} />;
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
        mode={uploadMode}
        patient={patient}
        job={job}
        message={message}
        consenting={consentState.isLoading}
        uploading={intentState.isLoading}
        onConsent={consent}
        onSubmit={submitDocuments}
        onBack={backToHome}
        onDone={uploadDone}
      />
    );
  } else if (tab === "home") {
    content = <HomeScreen patient={patient} onNewClaim={startClaim} onAskPolicy={() => setQaOpen(true)} onViewDocuments={() => setDocsOpen(true)} onNav={onNav} />;
  } else if (tab === "health") {
    content = <HealthScreen patient={patient} onViewDocuments={() => setDocsOpen(true)} />;
  } else if (tab === "schemes") {
    content = <SchemesScreen patient={patient} />;
  } else {
    content = <ProfileScreen patient={patient} onSwitchPatient={switchPatient} />;
  }

  return (
    <AppShell active={claimStep ? "claim" : tab} onNav={onNav}>
      {content}
    </AppShell>
  );
}

type ClaimTaskProps = {
  step: ClaimStep;
  mode: UploadMode;
  patient: Patient | null;
  job: { status: string } | undefined;
  message: string;
  consenting: boolean;
  uploading: boolean;
  onConsent: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  onDone: () => void;
};

function ClaimTask({ step, mode, patient, job, message, consenting, uploading, onConsent, onSubmit, onBack, onDone }: ClaimTaskProps) {
  const isClaim = mode === "claim";
  const completed = job?.status === "completed";
  const failed = job?.status === "failed";
  return (
    <div>
      <button type="button" onClick={onBack} className="aayu-text-body-sm mb-6 inline-flex items-center gap-1 font-medium text-(--aayu-teal-600)">
        ← Back to dashboard
      </button>

      {step === "consent" && (
        <section aria-labelledby="consent-title" className="aayu-card">
          <p className="aayu-text-body-sm mb-2 text-(--aayu-text-secondary)">Before the first upload</p>
          <h1 id="consent-title" className="aayu-text-display mb-4 font-medium text-(--aayu-ink-900)">You stay in control</h1>
          <p className="aayu-text-body-sm mb-6 text-(--aayu-text-secondary)">
            Aayu will securely process these documents to assess claims and build{" "}
            {patient?.name ?? "this patient"}&rsquo;s health record. We won&rsquo;t use them for advertising.
          </p>
          <button className="primary-button" onClick={onConsent} disabled={consenting}>I understand, continue</button>
        </section>
      )}

      {step === "upload" && (
        <section aria-labelledby="upload-title">
          <h1 id="upload-title" className="aayu-text-display mb-3 font-medium text-(--aayu-ink-900)">
            {isClaim ? "Upload the claim document" : "Add a document"}
          </h1>
          <p className="aayu-text-body-sm mb-8 text-(--aayu-text-secondary)">
            {isClaim
              ? "Start with the rejection letter. You can add the policy and bills later."
              : "Choose the document type and upload a PDF or photo. Aayu reads it into the health record."}
          </p>
          <form className="aayu-card grid gap-5" onSubmit={onSubmit}>
            <label>Document type
              <select name="kind" defaultValue={isClaim ? "rejection_letter" : "lab_report"}>
                {DOC_KIND_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label>PDF, photo, or audio<input required name="document" type="file" accept="application/pdf,image/jpeg,image/png,image/webp,audio/*" /></label>
            {message && <p role="alert" className="aayu-text-body-sm text-(--aayu-danger)">{message}</p>}
            <button className="primary-button" disabled={uploading}>{isClaim ? "Upload and assess" : "Upload"}</button>
          </form>
        </section>
      )}

      {step === "processing" && (
        <>
          <StateCard
            title={
              failed
                ? "We couldn't read this document"
                : completed
                  ? "Document added"
                  : isClaim
                    ? "Finding the relevant claim details…"
                    : "Reading your document…"
            }
            body={
              failed
                ? "Check the document and try uploading it again."
                : completed
                  ? "It's been read into the health record."
                  : "Your file is safely uploaded. You can leave this screen while we process it."
            }
          />
          {/* The top back link already covers "back to dashboard" for every other state here —
              only "view documents" (a distinct destination) earns its own button. */}
          {completed && !isClaim && (
            <button type="button" onClick={onDone} className="primary-button mt-6">View documents</button>
          )}
        </>
      )}
    </div>
  );
}

function ProfileScreen({ patient, onSwitchPatient }: { patient: Patient | null; onSwitchPatient: () => void }) {
  return (
    <section aria-labelledby="profile-title" className="grid gap-5">
      <h1 id="profile-title" className="aayu-text-display font-medium text-(--aayu-ink-900)">Profile</h1>
      <div className="aayu-card grid gap-1">
        <span className="aayu-text-body-sm font-medium text-(--aayu-text-primary)">{patient?.name ?? "Patient"}</span>
        <span className="aayu-text-body-sm text-(--aayu-text-secondary)">{patient?.relationship ?? ""}</span>
      </div>
      <div className="aayu-card flex items-center gap-3">
        {clerkActive ? <UserButton /> : null}
        <span className="aayu-text-body-sm text-(--aayu-text-secondary)">{clerkActive ? "Manage your account or sign out" : "Development session"}</span>
      </div>
      <button type="button" onClick={onSwitchPatient} className="aayu-text-body-sm text-left font-medium text-(--aayu-teal-600)">Switch patient</button>
    </section>
  );
}

function StateCard({ title, body }: { title: string; body?: string }) {
  return (
    <section className="aayu-card" aria-live="polite">
      <h1 className="aayu-text-h1 mb-3 font-medium text-(--aayu-ink-900)">{title}</h1>
      {body && <p className="aayu-text-body-sm text-(--aayu-text-secondary)">{body}</p>}
    </section>
  );
}
