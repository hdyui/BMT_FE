import { ApiError } from "@/shared/lib/api/errors";

export interface FormSubmissionInput {
  customerName: string;
  phone: string;
}

/**
 * `POST /form-submissions` — khách để lại họ tên và số điện thoại ở mọi form
 * "Liên hệ tư vấn". Endpoint công khai (không gửi cookie) và KHÔNG có bản lưu
 * tạm ở trình duyệt: gửi lỗi thì ném lỗi để form báo cho khách thử lại, không
 * bao giờ báo thành công khi backend chưa nhận được.
 */
export async function submitFormSubmission(input: FormSubmissionInput) {
  const response = await fetch("/api/form-submissions", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.isSuccess === false || result?.isFailed === true) {
    throw new ApiError({
      status: response.status,
      message:
        typeof result?.message === "string"
          ? result.message
          : "Form submission failed.",
    });
  }
  return result;
}

/** Câu báo lỗi cho khách khi gửi form không thành công. */
export function describeSubmitError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 429) return "Bạn gửi quá nhanh, vui lòng thử lại sau ít phút.";
    if (error.status === 400 || error.status === 422) {
      return "Thông tin chưa hợp lệ, vui lòng kiểm tra lại họ tên và số điện thoại.";
    }
  }
  return "Không gửi được thông tin lúc này, vui lòng thử lại.";
}
