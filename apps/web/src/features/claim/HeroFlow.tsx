import { UserButton } from "@clerk/react";
import { type FormEvent, useState } from "react";

import { useAppSelector } from "../../app/store";
import {
  useAcceptConsentMutation,
  useCompleteUploadMutation,
  useConsentStatusQuery,
  useCreatePatientMutation,
  useCreateUploadIntentMutation,
  useDeletePatientMutation,
  useJobQuery,
  usePatientsQuery,
  useSaveEligibilityProfileMutation,
  useUpdatePatientMutation,
  useWithdrawConsentMutation,
  uploadFile,
} from "../../services/api";
import type { EligibilityProfileInput, Patient, PatientInput } from "../../services/api";
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
const relationshipLabels: Record<string, string> = {
  self: "Myself",
  mother: "Mother",
  father: "Father",
  spouse: "Spouse or partner",
  child: "Child",
  sibling: "Sibling",
  family_member: "Family member",
  other: "Other",
};
const relationshipLabel = (relationship: string) => relationshipLabels[relationship] ?? relationship;

function eligibilityFrom(input: PatientInput): EligibilityProfileInput | null {
  const profile = input.profile;
  if (profile.monthly_household_income === null || !profile.employment_type) return null;
  return {
    monthly_household_income: profile.monthly_household_income,
    employment_type: profile.employment_type as EligibilityProfileInput["employment_type"],
    has_bpl_or_antyodaya_ration_card: profile.has_bpl_or_antyodaya_ration_card,
    has_disability: profile.has_disability,
    is_pregnant_or_recent_mother: profile.is_pregnant_or_recent_mother,
  };
}

export function HeroFlow() {
  const token = useAppSelector((state) => state.auth.token);
  const { data: patients = [], isLoading } = usePatientsQuery();
  const [createPatient, patientState] = useCreatePatientMutation();
  const [updatePatient, updatePatientState] = useUpdatePatientMutation();
  const [deletePatient, deleteState] = useDeletePatientMutation();
  const [acceptConsent, consentState] = useAcceptConsentMutation();
  const [withdrawConsent, withdrawConsentState] = useWithdrawConsentMutation();
  const [createIntent, intentState] = useCreateUploadIntentMutation();
  const [completeUpload] = useCompleteUploadMutation();
  const [saveEligibilityProfile] = useSaveEligibilityProfileMutation();

  const [patientId, setPatientId] = useState("");
  const [skippedProfile, setSkippedProfile] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [pendingConsentWithdrawal, setPendingConsentWithdrawal] = useState(false);
  const [consentMessage, setConsentMessage] = useState("");
  const [consented, setConsented] = useState(false);
  const [tab, setTab] = useState<Tab>("home");
  const [claimStep, setClaimStep] = useState<ClaimStep | null>(null);
  const [uploadMode, setUploadMode] = useState<UploadMode>("claim");
  const [documentKind, setDocumentKind] = useState("rejection_letter");
  const [qaOpen, setQaOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [jobId, setJobId] = useState("");
  const [message, setMessage] = useState("");
  const [editingPatient, setEditingPatient] = useState<Patient | "new" | null>(null);
  const [patientMessage, setPatientMessage] = useState("");
  const { data: job } = useJobQuery(jobId, { skip: !jobId, pollingInterval: jobId ? 3000 : 0 });
  const { data: consentStatus, refetch: refetchConsentStatus } = useConsentStatusQuery(patientId, { skip: !patientId });

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
      const eligibility = eligibilityFrom(input);
      if (eligibility) await saveEligibilityProfile({ patientId: created.id, ...eligibility }).unwrap();
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
      const eligibility = eligibilityFrom(input);
      if (eligibility) await saveEligibilityProfile({ patientId: saved.id, ...eligibility }).unwrap();
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

  async function confirmConsentWithdrawal() {
    if (!patientId) return;
    setConsentMessage("");
    try {
      await withdrawConsent(patientId).unwrap();
      setConsented(false);
      setPendingConsentWithdrawal(false);
      await refetchConsentStatus();
    } catch {
      setConsentMessage("We couldn't update consent. Please try again.");
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

  const launchUpload = (mode: UploadMode, kind = mode === "claim" ? "rejection_letter" : "lab_report") => {
    if (!patientId) return promptCreateProfile();
    setMessage("");
    setUploadMode(mode);
    setDocumentKind(kind);
    setQaOpen(false);
    setDocsOpen(false);
    setClaimOpen(false);
    setClaimStep(consented || consentStatus?.accepted ? "upload" : "consent");
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

  // Profile setup — choose a person first; medical and scheme detail can be added gradually.
  if (!patientId && !skippedProfile) {
    return (
      <>
        <main className="mx-auto min-h-screen max-w-200 px-4 py-8 sm:py-14">
          <header className="aayu-text-h1 mb-10 font-medium text-(--aayu-teal-600)">Aayu</header>
          <section aria-labelledby="patient-title">
            <p className="aayu-text-body-sm mb-2 text-(--aayu-text-secondary)">{patients.length ? "Welcome back" : "Let’s get started"}</p>
            <h1 id="patient-title" className="aayu-text-display mb-3 font-medium text-(--aayu-ink-900)">{editingPatient === "new" ? "Add a care profile" : patients.length ? "Choose a person" : "Create the first care profile"}</h1>
            <p className="aayu-text-body-sm mb-8 text-(--aayu-text-secondary)">{editingPatient === "new" ? "Start with the basics. You can skip any detail you do not have yet." : patients.length ? "Each person has a separate health, claims, and scheme view." : "Start with yourself, a parent, or another family member. You can build out the details gradually."}</p>
            {patients.length > 0 && editingPatient !== "new" && (
              <div className="mb-8 grid gap-3 sm:grid-cols-2" aria-label="Your care profiles">
                {patients.map((existing) => (
                  <button key={existing.id}
                    className="aayu-card flex min-h-34 flex-col items-start justify-between gap-3 text-left transition hover:border-(--aayu-teal-600)"
                    onClick={() => { setPatientId(existing.id); setTab("home"); }}
                    type="button"
                    aria-label={`Continue as ${existing.name}`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--aayu-teal-100) aayu-text-h2 font-medium text-(--aayu-teal-800)">{existing.name.charAt(0).toUpperCase()}</span>
                      <span className="min-w-0">
                        <span className="aayu-text-body-sm block font-medium text-(--aayu-text-primary)">{existing.name}</span>
                        <span className="aayu-text-body-sm text-(--aayu-text-secondary)">{relationshipLabel(existing.relationship)}</span>
                      </span>
                    </span>
                    <span className="aayu-text-body-sm shrink-0 font-medium text-(--aayu-teal-600)">Open profile →</span>
                  </button>
                ))}
                <button type="button" onClick={() => { setPatientMessage(""); setEditingPatient("new"); }} className="flex min-h-34 flex-col items-start justify-center gap-3 rounded-xl border border-dashed border-(--aayu-border-strong) bg-transparent p-6 text-left"><span className="grid h-10 w-10 place-items-center rounded-full bg-(--aayu-teal-50) text-(--aayu-teal-700)">+</span><span><span className="aayu-text-body-sm block font-medium">Add a person</span><span className="aayu-text-caption text-(--aayu-text-secondary)">Parent, child, partner, or another dependent</span></span></button>
              </div>
            )}
            {(patients.length === 0 || editingPatient === "new") && <PatientForm
              busy={patientState.isLoading}
              message={patientMessage}
              submitLabel="Save profile"
              onCancel={patients.length ? () => setEditingPatient(null) : undefined}
              onSave={async (input) => { if (await createAndSelectPatient(input, "home")) setEditingPatient(null); }}
            />}
            {patients.length === 0 && <button type="button" onClick={() => setSkippedProfile(true)} className="aayu-text-body-sm mt-4 font-medium text-(--aayu-teal-700)">Browse Aayu first</button>}
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
    content = <DocumentsScreen patient={patient} onBack={backToHome} onAdd={(kind) => launchUpload("document", kind)} />;
  } else if (showResult || claimOpen) {
    content = (
      <ClaimResultScreen
        patient={patient}
        onViewHealth={() => { setClaimOpen(false); setClaimStep(null); setJobId(""); setTab("health"); }}
        onBack={backToHome}
        onNewClaim={startClaim}
        onAddEvidence={() => launchUpload("document")}
      />
    );
  } else if (claimStep) {
    content = (
      <ClaimTask
        step={claimStep}
        mode={uploadMode}
        documentKind={documentKind}
        patient={patient}
        job={job}
        message={message}
        consenting={consentState.isLoading}
        uploading={intentState.isLoading}
        onConsent={consent}
        onSubmit={submitDocuments}
        onBack={backToHome}
        onDone={uploadDone}
        onRetry={() => launchUpload(uploadMode, documentKind)}
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
          submitLabel={editingPatient === "new" ? "Save profile" : undefined}
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
        consentStatus={consentStatus}
        onWithdrawConsent={() => { setConsentMessage(""); setPendingConsentWithdrawal(true); }}
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
      {pendingConsentWithdrawal && (
        <ConfirmDialog
          title="Withdraw upload consent?"
          message="New uploads and document processing for this patient will pause. Existing documents and records are not deleted."
          confirmLabel="Withdraw consent"
          pending={withdrawConsentState.isLoading}
          error={consentMessage}
          onConfirm={confirmConsentWithdrawal}
          onCancel={() => setPendingConsentWithdrawal(false)}
        />
      )}
    </>
  );
}

type ClaimTaskProps = {
  step: ClaimStep;
  mode: UploadMode;
  documentKind: string;
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

function ClaimTask({ step, mode, documentKind, patient, job, message, consenting, uploading, onConsent, onSubmit, onBack, onDone, onRetry }: ClaimTaskProps) {
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
              <select name="kind" defaultValue={documentKind}>
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

function ProfileScreen({ patient, patients, onAddPatient, onEditPatient, onSelectPatient, onDeletePatient, deleting, consentStatus, onWithdrawConsent }: {
  patient: Patient | null;
  patients: Patient[];
  onAddPatient: () => void;
  onEditPatient: () => void;
  onSelectPatient: (id: string) => void;
  onDeletePatient: (id: string, name: string) => void;
  deleting: boolean;
  consentStatus: { accepted: boolean; accepted_at: string | null } | undefined;
  onWithdrawConsent: () => void;
}) {
  const [showSecurity, setShowSecurity] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  return (
    <section aria-labelledby="profile-title" className="grid gap-5">
      <h1 id="profile-title" className="aayu-text-display font-medium text-(--aayu-ink-900)">Profile</h1>
      <div className="aayu-card flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-(--aayu-teal-100) aayu-text-h2 font-medium text-(--aayu-teal-900)">C</span>
        <span className="min-w-0 flex-1">
          <span className="aayu-text-h2 block font-medium text-(--aayu-text-primary)">Your Aayu account</span>
          <span className="aayu-text-body-sm text-(--aayu-text-secondary)">{clerkActive ? "Manage your account or sign out" : "Development session"}</span>
        </span>
        {clerkActive ? <UserButton /> : null}
      </div>
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="aayu-text-label font-medium uppercase tracking-wide text-(--aayu-text-secondary)">Care profiles</h2>
          <button type="button" onClick={onAddPatient} className="aayu-text-body-sm font-medium text-(--aayu-teal-600)">Add profile</button>
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
              <button type="button" onClick={() => onSelectPatient(existing.id)} className="min-w-0 flex-1 text-left" aria-label={`Select ${existing.name}`}>
                <span className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-(--aayu-teal-100) aayu-text-body font-medium text-(--aayu-teal-900)">{existing.name.charAt(0).toUpperCase()}</span>
                  <span className="grid gap-1">
                  <span className="aayu-text-body-sm font-medium text-(--aayu-text-primary)">{existing.name}</span>
                  <span className="aayu-text-body-sm text-(--aayu-text-secondary)">{relationshipLabel(existing.relationship)}{existing.date_of_birth ? ` · ${existing.date_of_birth}` : ""}</span>
                  </span>
                </span>
              </button>
              <span className="aayu-text-body-sm font-medium text-(--aayu-teal-600)">{selected ? "Selected" : "Select"}</span>
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
      {patient ? (
        <div className="aayu-card grid gap-3">
          <div><span className="aayu-text-label block text-(--aayu-text-secondary)">Viewing</span><span className="aayu-text-h2 text-(--aayu-text-primary)">{patient.name}&rsquo;s care profile</span></div>
          <p className="aayu-text-body-sm text-(--aayu-text-secondary)">Health history, insurance, emergency contacts, and care preferences stay linked to this patient.</p>
          <button type="button" onClick={onEditPatient} className="secondary-button justify-self-start">Edit {patient.name}&rsquo;s profile</button>
        </div>
      ) : <p className="aayu-text-body-sm text-(--aayu-text-secondary)">Choose a family profile or add one to manage care details and documents.</p>}
      <div>
        <h2 className="aayu-text-label mb-3 font-medium uppercase tracking-wide text-(--aayu-text-secondary)">Settings</h2>
        <div className="overflow-hidden rounded-(--radius-md) border border-(--aayu-border) bg-(--aayu-surface-card)">
          <button type="button" onClick={() => setShowSecurity((open) => !open)} aria-expanded={showSecurity} className="flex w-full items-center gap-3 border-b border-(--aayu-border) px-4 py-4 text-left">
            <Icon name="shield" size={20} color="var(--aayu-teal-600)" /><span className="flex-1"><span className="aayu-text-body-sm block font-medium text-(--aayu-text-primary)">Security & encryption</span><span className="aayu-text-body-sm text-(--aayu-text-secondary)">How Aayu protects your documents</span></span><span className="text-(--aayu-text-muted)">{showSecurity ? "−" : "+"}</span>
          </button>
          {showSecurity && <p className="aayu-text-body-sm border-b border-(--aayu-border) bg-(--aayu-surface-muted) px-4 py-3 text-(--aayu-text-secondary)">Documents are scoped to the selected patient and only available to your signed-in account. You can remove a patient profile and its linked data from this screen.</p>}
          <button type="button" onClick={() => setShowConsent((open) => !open)} aria-expanded={showConsent} className="flex w-full items-center gap-3 border-b border-(--aayu-border) px-4 py-4 text-left">
            <Icon name="claim" size={20} color="var(--aayu-teal-600)" /><span className="flex-1"><span className="aayu-text-body-sm block font-medium text-(--aayu-text-primary)">Data & consent</span><span className="aayu-text-body-sm text-(--aayu-text-secondary)">{patient ? (consentStatus?.accepted ? "Upload consent active" : "Upload consent not granted") : "Choose a patient to review consent"}</span></span><span className="text-(--aayu-text-muted)">{showConsent ? "−" : "+"}</span>
          </button>
          {showConsent && <div className="grid gap-3 border-b border-(--aayu-border) bg-(--aayu-surface-muted) px-4 py-3"><p className="aayu-text-body-sm text-(--aayu-text-secondary)">{consentStatus?.accepted ? `Consent is active${consentStatus.accepted_at ? ` since ${new Date(consentStatus.accepted_at).toLocaleDateString("en-IN")}` : ""}.` : "Consent is required before Aayu can process new uploads."}</p>{patient && consentStatus?.accepted && <button type="button" onClick={onWithdrawConsent} className="secondary-button w-fit text-(--aayu-danger)">Withdraw upload consent</button>}</div>}
          <a href="mailto:support@aayu.health?subject=Aayu%20support" className="flex items-center gap-3 px-4 py-4"><Icon name="chat" size={20} color="var(--aayu-teal-600)" /><span><span className="aayu-text-body-sm block font-medium text-(--aayu-text-primary)">Help & support</span><span className="aayu-text-body-sm text-(--aayu-text-secondary)">Contact the Aayu support team</span></span></a>
        </div>
      </div>
      <p className="aayu-text-caption inline-flex items-center gap-2 rounded-full bg-(--aayu-success-bg) px-3 py-2 font-medium text-(--aayu-teal-900)"><Icon name="shield" size={14} color="var(--aayu-teal-600)" />You can delete a patient profile and its linked records anytime.</p>
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
