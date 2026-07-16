import { UserButton } from "@clerk/react";
import { type FormEvent, useState } from "react";

import { useAppSelector } from "../../app/store";
import {
  useAcceptConsentMutation,
  useCompleteUploadMutation,
  useCreatePatientMutation,
  useCreateUploadIntentMutation,
  useDeletePatientMutation,
  useJobQuery,
  usePatientsQuery,
  useUpdatePatientMutation,
  uploadFile,
} from "../../services/api";
import type { Patient, PatientInput } from "../../services/api";
import { AppShell, type Tab } from "../app/AppShell";
import { ConfirmDialog } from "../app/ConfirmDialog";
import { Icon } from "../app/Icon";
import { AppLoadingSkeleton } from "../app/Skeleton";
import { HealthScreen, SchemesScreen } from "../app/TabScreens";
import { DocumentsScreen } from "../documents/DocumentsScreen";
import { DOC_KIND_OPTIONS } from "../documents/kinds";
import { HomeScreen } from "../home/HomeScreen";
import { PatientForm } from "../patients/PatientForm";
import { PolicyQAScreen } from "../policy/PolicyQAScreen";
import { ClaimResultScreen } from "./ClaimResultScreen";

type ClaimStep = "consent" | "upload" | "processing";
type UploadMode = "claim" | "document";

const clerkActive = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

export function HeroFlow() {
  const token = useAppSelector((state) => state.auth.token);
  const { data: patients = [], isLoading } = usePatientsQuery();
  const [createPatient, patientState] = useCreatePatientMutation();
  const [updatePatient, updatePatientState] = useUpdatePatientMutation();
  const [deletePatient, deleteState] = useDeletePatientMutation();
  const [acceptConsent, consentState] = useAcceptConsentMutation();
  const [createIntent, intentState] = useCreateUploadIntentMutation();
  const [completeUpload] = useCompleteUploadMutation();

  const [patientId, setPatientId] = useState("");
  const [skippedProfile, setSkippedProfile] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [consented, setConsented] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [claimStep, setClaimStep] = useState<ClaimStep | null>(null);
  const [uploadMode, setUploadMode] = useState<UploadMode>("claim");
  const [qaOpen, setQaOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [jobId, setJobId] = useState("");
  const [message, setMessage] = useState("");
  const [editingPatient, setEditingPatient] = useState<Patient | "new" | null>(null);
  const [patientMessage, setPatientMessage] = useState("");
  const { data: job } = useJobQuery(jobId, { skip: !jobId, pollingInterval: jobId ? 3000 : 0 });

  const patient = patients.find((p) => p.id === patientId) ?? null;

  // Profile creation is optional — a signed-in user can skip it and browse,
  // but anything that actually needs a patient (claim, policy Q&A, documents)
  // routes back here instead of hitting the backend with an empty id.
  const promptCreateProfile = () => setSkippedProfile(false);

  const requestDeletePatient = (id: string, name: string) => {
    setDeleteMessage("");
    setPendingDelete({ id, name });
  };

  async function confirmDeletePatient() {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    try {
      await deletePatient(id).unwrap();
      if (id === patientId) { setPatientId(""); setTab("home"); }
      setPendingDelete(null);
    } catch {
      setDeleteMessage("We couldn't delete this profile. Please try again.");
    }
  }

  async function createAndSelectPatient(input: PatientInput, destination: Tab) {
    setPatientMessage("");
    try {
      const created = await createPatient(input).unwrap();
      setPatientId(created.id);
      setTab(destination);
      return true;
    } catch {
      setPatientMessage("We couldn't save this patient. Check the details and try again.");
      return false;
    }
  }

  async function savePatient(input: PatientInput) {
    if (editingPatient === "new") {
      if (await createAndSelectPatient(input, "profile")) setEditingPatient(null);
      return;
    }
    setPatientMessage("");
    try {
      const saved = await updatePatient({ patientId: editingPatient!.id, body: input }).unwrap();
      setPatientId(saved.id);
      setEditingPatient(null);
      setTab("profile");
    } catch {
      setPatientMessage("We couldn't save this patient. Check the details and try again.");
    }
  }

  async function consent() {
    setMessage("");
    try {
      await acceptConsent(patientId).unwrap();
      setConsented(true);
      setClaimStep("upload");
    } catch {
      setMessage("We couldn&rsquo;t save your consent. Please try again.");
    }
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
    if (!patientId) return promptCreateProfile();
    setMessage("");
    setUploadMode(mode);
    setQaOpen(false);
    setDocsOpen(false);
    setClaimOpen(false);
    setClaimStep(consented ? "upload" : "consent");
  };
  const startClaim = () => launchUpload("claim");
  const askPolicy = () => (patientId ? setQaOpen(true) : promptCreateProfile());
  const viewDocuments = () => (patientId ? setDocsOpen(true) : promptCreateProfile());

  const backToHome = () => {
    setClaimStep(null);
    setQaOpen(false);
    setDocsOpen(false);
    setClaimOpen(false);
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
    setClaimOpen(false);
    if (id === "claim") return startClaim();
    setClaimStep(null);
    setTab(id);
  };

  if (isLoading) return <AppLoadingSkeleton />;

  // Profile setup — create or select a patient, or skip and do it later.
  if (!patientId && !skippedProfile) {
    return (
      <>
        <main className="mx-auto min-h-screen max-w-200 px-4 py-8 sm:py-14">
          <header className="aayu-text-h1 mb-10 font-medium text-(--aayu-ink-900)">Aayu</header>
          <section aria-labelledby="patient-title">
            <p className="aayu-text-body-sm mb-2 text-(--aayu-text-secondary)">First, who are we helping?</p>
            <h1 id="patient-title" className="aayu-text-display mb-3 font-medium text-(--aayu-ink-900)">Create a patient profile</h1>
            <p className="aayu-text-body-sm mb-8 text-(--aayu-text-secondary)">Their claim documents and health record stay together.</p>
            {patients.length > 0 && (
              <div className="mb-6 grid gap-3">
                {patients.map((existing) => (
                  <div key={existing.id} className="aayu-card flex items-center justify-between gap-3">
                    <button
                      className="min-w-0 flex-1 text-left"
                      onClick={() => { setPatientId(existing.id); setTab("home"); }}
                      type="button"
                    >
                      <span className="aayu-text-body-sm block font-medium text-(--aayu-text-primary)">{existing.name}</span>
                      <span className="aayu-text-body-sm text-(--aayu-text-secondary)">{existing.relationship}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => requestDeletePatient(existing.id, existing.name)}
                      disabled={deleteState.isLoading}
                      aria-label={`Delete ${existing.name}'s profile`}
                      className="shrink-0 rounded-full p-2 text-(--aayu-danger) hover:bg-(--aayu-danger-bg)"
                    >
                      <Icon name="trash" size={18} color="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <PatientForm
              busy={patientState.isLoading}
              message={patientMessage}
              submitLabel="Create"
              onSave={async (input) => { await createAndSelectPatient(input, "home"); }}
              secondaryAction={
                <button type="button" onClick={() => setSkippedProfile(true)} className="secondary-button">Skip</button>
              }
            />
          </section>
        </main>
        {pendingDelete && (
          <ConfirmDialog
            title="Delete this profile?"
            message={`This permanently removes ${pendingDelete.name}'s claim documents, health record, and scheme matches.`}
            confirmLabel="Delete profile"
            pending={deleteState.isLoading}
            error={deleteMessage}
            onConfirm={confirmDeletePatient}
            onCancel={() => setPendingDelete(null)}
          />
        )}
      </>
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
  } else if (showResult || claimOpen) {
    content = (
      <ClaimResultScreen
        patient={patient}
        onViewHealth={() => { setClaimOpen(false); setClaimStep(null); setJobId(""); setTab("health"); }}
        onBack={backToHome}
        onNewClaim={startClaim}
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
        onRetry={() => launchUpload(uploadMode)}
      />
    );
  } else if (tab === "home") {
    content = <HomeScreen
      patient={patient}
      onNewClaim={startClaim}
      onViewClaim={() => setClaimOpen(true)}
      onAskPolicy={askPolicy}
      onViewDocuments={viewDocuments}
      onNav={onNav}
    />;
  } else if (tab === "health") {
    content = <HealthScreen patient={patient} onViewDocuments={viewDocuments} />;
  } else if (tab === "schemes") {
    content = <SchemesScreen patient={patient} />;
  } else {
    content = editingPatient ? (
      <section aria-labelledby="patient-editor-title" className="grid gap-5">
        <div>
          <p className="aayu-text-body-sm mb-2 text-(--aayu-text-secondary)">Patient profile</p>
          <h1 id="patient-editor-title" className="aayu-text-display font-medium text-(--aayu-ink-900)">{editingPatient === "new" ? "Add a patient" : "Edit patient"}</h1>
        </div>
        <PatientForm
          patient={editingPatient === "new" ? undefined : editingPatient}
          busy={patientState.isLoading || updatePatientState.isLoading}
          onCancel={() => setEditingPatient(null)}
          onSave={savePatient}
          submitLabel={editingPatient === "new" ? "Add patient" : undefined}
          message={patientMessage}
        />
      </section>
    ) : (
      <ProfileScreen
        patient={patient}
        patients={patients}
        onAddPatient={() => { setPatientMessage(""); setEditingPatient("new"); }}
        onEditPatient={() => { if (patient) { setPatientMessage(""); setEditingPatient(patient); } }}
        onSelectPatient={(id) => setPatientId(id)}
        onDeletePatient={requestDeletePatient}
        deleting={deleteState.isLoading}
      />
    );
  }

  return (
    <>
      <AppShell active={claimStep ? "claim" : tab} onNav={onNav}>
        {content}
      </AppShell>
      {pendingDelete && (
        <ConfirmDialog
          title="Delete this profile?"
          message={`This permanently removes ${pendingDelete.name}'s claim documents, health record, and scheme matches.`}
          confirmLabel="Delete profile"
          pending={deleteState.isLoading}
          error={deleteMessage}
          onConfirm={confirmDeletePatient}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </>
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
  onRetry: () => void;
};

function ClaimTask({ step, mode, patient, job, message, consenting, uploading, onConsent, onSubmit, onBack, onDone, onRetry }: ClaimTaskProps) {
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
          {message && <p role="alert" className="aayu-text-body-sm mb-4 text-(--aayu-danger)">{message}</p>}
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
          {failed && <button type="button" onClick={onRetry} className="primary-button mt-6">Try another file</button>}
        </>
      )}
    </div>
  );
}

function ProfileScreen({ patient, patients, onAddPatient, onEditPatient, onSelectPatient, onDeletePatient, deleting }: {
  patient: Patient | null;
  patients: Patient[];
  onAddPatient: () => void;
  onEditPatient: () => void;
  onSelectPatient: (id: string) => void;
  onDeletePatient: (id: string, name: string) => void;
  deleting: boolean;
}) {
  return (
    <section aria-labelledby="profile-title" className="grid gap-5">
      <h1 id="profile-title" className="aayu-text-display font-medium text-(--aayu-ink-900)">Profile</h1>
      <div className="aayu-card flex items-center gap-3">
        {clerkActive ? <UserButton /> : null}
        <span className="aayu-text-body-sm text-(--aayu-text-secondary)">{clerkActive ? "Manage your account or sign out" : "Development session"}</span>
      </div>
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="aayu-text-label font-medium uppercase tracking-wide text-(--aayu-text-secondary)">Patients you manage</h2>
          <button type="button" onClick={onAddPatient} className="aayu-text-body-sm font-medium text-(--aayu-teal-600)">Add patient</button>
        </div>
        {patients.length === 0 && (
          <p className="aayu-text-body-sm text-(--aayu-text-secondary)">No profiles yet — add one to start a claim or build a health record.</p>
        )}
        {patients.map((existing) => {
          const selected = existing.id === patient?.id;
          return (
            <div
              key={existing.id}
              className="aayu-card flex items-center justify-between gap-4"
              style={{ borderColor: selected ? "var(--aayu-teal-600)" : undefined }}
            >
              <button type="button" onClick={() => onSelectPatient(existing.id)} className="min-w-0 flex-1 text-left">
                <span className="grid gap-1">
                  <span className="aayu-text-body-sm font-medium text-(--aayu-text-primary)">{existing.name}</span>
                  <span className="aayu-text-body-sm text-(--aayu-text-secondary)">{existing.relationship}{existing.date_of_birth ? ` · ${existing.date_of_birth}` : ""}</span>
                </span>
              </button>
              <span className="aayu-text-body-sm font-medium text-(--aayu-teal-600)">{selected ? "Current" : "Switch"}</span>
              <button
                type="button"
                onClick={() => onDeletePatient(existing.id, existing.name)}
                disabled={deleting}
                aria-label={`Delete ${existing.name}'s profile`}
                className="shrink-0 rounded-full p-2 text-(--aayu-danger) hover:bg-(--aayu-danger-bg)"
              >
                <Icon name="trash" size={18} color="currentColor" />
              </button>
            </div>
          );
        })}
      </div>
      <button type="button" onClick={onEditPatient} className="secondary-button justify-self-start">Edit current patient</button>
      <p className="aayu-text-body-sm text-(--aayu-text-secondary)">Your documents stay encrypted and linked only to the patient you select.</p>
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
