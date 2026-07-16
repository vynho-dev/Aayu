import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { RootState } from "../app/store";

export type Patient = {
  id: string;
  name: string;
  relationship: string;
  date_of_birth: string | null;
};

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
  tagTypes: ["Patient", "Job"],
  endpoints: (build) => ({
    patients: build.query<Patient[], void>({
      query: () => "patients",
      providesTags: ["Patient"],
    }),
    createPatient: build.mutation<Patient, Pick<Patient, "name" | "relationship">>({
      query: (body) => ({ url: "patients", method: "POST", body }),
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
      invalidatesTags: ["Job"],
    }),
    job: build.query<ProcessingJob, string>({
      query: (jobId) => `jobs/${jobId}`,
      providesTags: ["Job"],
    }),
  }),
});

export const {
  useAcceptConsentMutation,
  useCompleteUploadMutation,
  useCreatePatientMutation,
  useCreateUploadIntentMutation,
  useJobQuery,
  usePatientsQuery,
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
