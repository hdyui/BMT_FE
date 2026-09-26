import { apiClient } from "@/lib/api";

export interface FormSubmissionInput {
  customerName: string;
  phone: string;
}

export function submitFormSubmission(input: FormSubmissionInput) {
  return apiClient.post("/api/v1/form-submissions", input);
}
