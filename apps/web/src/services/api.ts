import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { RootState } from "../app/store";

export type Patient = {
  id: string;
  name: string;
  relationship: string;
  date_of_birth: string | null;
};

export type PatientInput = Pick<Patient, "name" | "relationship" | "date_of_birth">;

export type UploadIntent = {
  document_id: string;
  upload_url: string;
  method: "PUT";
  headers: Record<string, string>;
};

export type ProcessingJob = {
  id: string;
  document_id: string;
  status: "pending_dispatch" | "queued" | "processing" | "completed" | "failed";
  error_code: string | null;
};

export type ClaimAssessment = {
  reason: string;
  contestable: boolean;
  recoverable_amount: number;
  documents_read: number;
  clause?: string | null;
  source: string;
};

export type ClaimResult = {
  id: string;
  status: string;
  assessment: ClaimAssessment | null;
  appeal_text: string | null;
  created_at: string;
};

export type HealthDocumentRef = { document_id: string; kind: string; filename: string; excerpt: string };

export type HealthRecord = {
  data: {
    summary?: string;
    amounts?: number[];
    conditions?: string[];
    medications?: string[];
    lab_findings?: string[];
    procedures?: string[];
    tests?: string[];
    follow_up?: string;
    documents?: HealthDocumentRef[];
  };
  updated_at: string | null;
};

export type DocumentSummary = {
  id: string;
  kind: string;
  filename: string;
  status: string;
  created_at: string;
};

export type SchemeMatch = { scheme_code: string; explanation: string; matched: boolean };

export type PolicyDocument = { document_id: string; status: string; index_ready: boolean };

export type PolicyAnswer = { answer: string; excerpts: string[] };

export type EmploymentType =
  | "government_employee_or_pensioner"
  | "organized_sector_employee"
  | "unorganized_sector_or_self_employed"
  | "farmer"
  | "unemployed";

export type EligibilityProfileInput = {
  monthly_household_income: number;
  employment_type: EmploymentType;
  has_bpl_or_antyodaya_ration_card: boolean;
  has_disability: boolean;
  is_pregnant_or_recent_mother: boolean;
};

export type EligibilityMatch = {
  scheme_code: string;
  name: string;
  authority: string;
  benefit_summary: string;
  official_url: string;
  explanation: string;
};

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/v1`,
    prepareHeaders(headers, { getState }) {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      else headers.set("X-Dev-User", "web_dev_user");
      return headers;
    },
  }),
  tagTypes: ["Patient", "Job", "Claim", "Health", "Scheme", "Policy", "Document"],
  endpoints: (build) => ({
    patients: build.query<Patient[], void>({
      query: () => "patients",
      providesTags: ["Patient"],
    }),
    createPatient: build.mutation<Patient, PatientInput>({
      query: (body) => ({ url: "patients", method: "POST", body }),
      invalidatesTags: ["Patient"],
    }),
    updatePatient: build.mutation<Patient, { patientId: string; body: PatientInput }>({
      query: ({ patientId, body }) => ({ url: `patients/${patientId}`, method: "PUT", body }),
      invalidatesTags: ["Patient"],
    }),
    deletePatient: build.mutation<void, string>({
      query: (patientId) => ({ url: `patients/${patientId}`, method: "DELETE" }),
      invalidatesTags: ["Patient"],
    }),
    acceptConsent: build.mutation<void, string>({
      query: (patientId) => ({
        url: `patients/${patientId}/consent`,
        method: "POST",
        body: { accepted: true },
      }),
    }),
    createUploadIntent: build.mutation<
      UploadIntent,
      { patientId: string; filename: string; content_type: string; kind: string }
    >({
      query: ({ patientId, ...body }) => ({
        url: `patients/${patientId}/documents/upload-intent`,
        method: "POST",
        body,
      }),
    }),
    completeUpload: build.mutation<ProcessingJob, string>({
      query: (documentId) => ({ url: `documents/${documentId}/complete`, method: "POST" }),
      invalidatesTags: ["Job", "Document", "Claim", "Health", "Scheme", "Policy"],
    }),
    job: build.query<ProcessingJob, string>({
      query: (jobId) => `jobs/${jobId}`,
      providesTags: ["Job"],
    }),
    claim: build.query<ClaimResult, string>({
      query: (patientId) => `patients/${patientId}/claim`,
      providesTags: ["Claim"],
    }),
    health: build.query<HealthRecord, string>({
      query: (patientId) => `patients/${patientId}/health`,
      providesTags: ["Health"],
    }),
    schemes: build.query<SchemeMatch[], string>({
      query: (patientId) => `patients/${patientId}/schemes`,
      providesTags: ["Scheme"],
    }),
    documents: build.query<DocumentSummary[], string>({
      query: (patientId) => `patients/${patientId}/documents`,
      providesTags: ["Document"],
    }),
    policyDocument: build.query<PolicyDocument, string>({
      query: (patientId) => `patients/${patientId}/policy-document`,
      providesTags: ["Policy"],
    }),
    askPolicy: build.mutation<PolicyAnswer, { patientId: string; documentId: string; question: string }>({
      query: ({ patientId, documentId, question }) => ({
        url: `patients/${patientId}/documents/${documentId}/policy-chat`,
        method: "POST",
        body: { question },
      }),
    }),
    saveEligibilityProfile: build.mutation<void, { patientId: string } & EligibilityProfileInput>({
      query: ({ patientId, ...body }) => ({
        url: `patients/${patientId}/eligibility-profile`,
        method: "PUT",
        body,
      }),
    }),
    eligibilityMatches: build.query<EligibilityMatch[], string>({
      query: (patientId) => `patients/${patientId}/scheme-matches`,
    }),
  }),
});

export const {
  useAcceptConsentMutation,
  useCompleteUploadMutation,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useCreateUploadIntentMutation,
  useJobQuery,
  usePatientsQuery,
  useClaimQuery,
  useHealthQuery,
  useSchemesQuery,
  usePolicyDocumentQuery,
  useAskPolicyMutation,
  useDocumentsQuery,
  useSaveEligibilityProfileMutation,
  useLazyEligibilityMatchesQuery,
} = api;

export async function uploadFile(intent: UploadIntent, file: File, token: string | null) {
  const headers = new Headers(intent.headers);
  if (intent.upload_url.startsWith(apiUrl)) {
    if (token) headers.set("authorization", `Bearer ${token}`);
    else headers.set("X-Dev-User", "web_dev_user");
  }
  const response = await fetch(intent.upload_url, { method: intent.method, headers, body: file });
  if (!response.ok) throw new Error("upload_failed");
}
