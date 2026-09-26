import { api } from "@/shared/lib/api/client";

/** Trạng thái của một lượt liên hệ trên backend. */
export type SubmissionStatus = "pending" | "done";

export interface FormSubmission {
  id: string;
  customerName: string;
  phone: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface FormSubmissionPage {
  items: FormSubmission[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** `GET /admin/form-submissions` — danh sách khách đã gửi form, mới nhất trước, có lọc theo trạng thái. */
export function listFormSubmissions(params: {
  pageIndex: number;
  pageSize: number;
  status?: SubmissionStatus;
}) {
  return api.get<FormSubmissionPage>("/admin/form-submissions", {
    query: { PageIndex: params.pageIndex, PageSize: params.pageSize, Status: params.status },
  });
}

/** `PATCH /admin/form-submissions/{id}/status` — đánh dấu đã xử lý / chưa xử lý. */
export function updateFormSubmissionStatus(id: string, status: SubmissionStatus) {
  return api.patch(`/admin/form-submissions/${id}/status`, { status });
}

/** `DELETE /admin/form-submissions/{id}`. */
export function deleteFormSubmission(id: string) {
  return api.delete(`/admin/form-submissions/${id}`);
}
